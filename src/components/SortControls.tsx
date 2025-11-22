import { LinearGradient } from "expo-linear-gradient";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { tokens } from "../theme/styles";

type BillSortKey = "nextDue" | "amount" | "name";
type InstallmentSortKey = "nextDue" | "remaining" | "name";
type SortKey = BillSortKey | InstallmentSortKey;

interface SortControlsProps {
  mode: "bill" | "installment";
  sortKey: SortKey;
  onChangeSortKey: (key: SortKey) => void;
  hasData: boolean;
  measurementDelayMs?: number;
}

/** clamp */
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/** safe hex -> rgba helper for fade colors */
function hexToRgba(hex: string, alpha = 1) {
  const h = hex.replace("#", "");
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16);
    const g = parseInt(h[1] + h[1], 16);
    const b = parseInt(h[2] + h[2], 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  if (h.length === 6 || h.length === 8) {
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  // fallback
  return `rgba(0,0,0,${alpha})`;
}

const SortControls = memo(
  ({
    mode,
    sortKey,
    onChangeSortKey,
    hasData,
    measurementDelayMs = 50,
  }: SortControlsProps) => {
    // ---------- top-level hooks ----------
    const theme = useTheme();
    const scrollViewRef = useRef<ScrollView | null>(null);
    const chipRefs = useRef<Array<View | null>>([]);
    const [scrollViewWidth, setScrollViewWidth] = useState(0);
    const [contentWidth, setContentWidth] = useState(0);
    const [measuredChips, setMeasuredChips] = useState<
      Array<{ x: number; width: number }>
    >([]);
    const [isMeasuring, setIsMeasuring] = useState(false);
    const [scrollX, setScrollX] = useState(0);

    // ---------- options ----------
    const options = useMemo(
      () =>
        mode === "bill"
          ? [
              { key: "nextDue" as SortKey, label: "Next due" },
              { key: "amount" as SortKey, label: "Amount" },
              { key: "name" as SortKey, label: "Name" },
            ]
          : [
              { key: "nextDue" as SortKey, label: "Next due" },
              { key: "remaining" as SortKey, label: "Remaining" },
              { key: "name" as SortKey, label: "Name" },
            ],
      [mode]
    );

    // ---------- styles ----------
    const baseButtonStyle = {
      marginHorizontal: 3,
      minWidth: undefined,
    } as const;

    const baseLabelStyle = {
      fontSize: 13,
      textTransform: "none" as const,
    };

    const activeChipStyle = {
      ...baseButtonStyle,
      borderRadius: 999,
      paddingHorizontal: 8,
      backgroundColor: theme.colors.primaryContainer,
    };

    const activeLabelStyle = {
      ...baseLabelStyle,
      color: theme.colors.onPrimaryContainer,
      fontWeight: "700" as const,
    };

    const inactiveLabelStyle = {
      ...baseLabelStyle,
      color: theme.colors.primary,
    };

    // ---------- measurement utils ----------
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const measureAll = useCallback(
      async (delay = measurementDelayMs) => {
        if (isMeasuring) return;
        setIsMeasuring(true);
        await wait(delay);

        let svX = 0;
        let svY = 0;
        let svW = 0;
        let svH = 0;
        const svNode = scrollViewRef.current as any;
        if (svNode && typeof svNode.measureInWindow === "function") {
          try {
            await new Promise<void>((resolve) =>
              svNode.measureInWindow(
                (x: number, y: number, w: number, h: number) => {
                  svX = x;
                  svY = y;
                  svW = w;
                  svH = h;
                  resolve();
                }
              )
            );
          } catch {
            // ignore
          }
        }

        const newMeasured: Array<{ x: number; width: number }> = [];

        for (let i = 0; i < options.length; i++) {
          const ref = chipRefs.current[i] as any;
          if (ref && typeof ref.measureInWindow === "function") {
            try {
              const { x, w } = await new Promise<{ x: number; w: number }>(
                (resolve) => {
                  ref.measureInWindow((cx: number, cy: number, cw: number) => {
                    resolve({ x: cx, w: cw });
                  });
                }
              );
              // relative x to scroll view content:
              const relX = x - svX;
              newMeasured.push({ x: relX, width: w });
            } catch {
              newMeasured.push({ x: 0, width: 0 });
            }
          } else {
            newMeasured.push({ x: 0, width: 0 });
          }
        }

        setMeasuredChips(newMeasured);
        setIsMeasuring(false);
      },
      [isMeasuring, measurementDelayMs, options.length]
    );

    // ---------- scroll-to-center logic ----------
    const scrollToChipCentered = useCallback(
      (index: number) => {
        if (
          !scrollViewRef.current ||
          measuredChips.length <= index ||
          scrollViewWidth <= 0
        )
          return;
        const chip = measuredChips[index];
        if (!chip) return;
        const chipCenter = chip.x + chip.width / 2;
        const targetX = clamp(
          chipCenter - scrollViewWidth / 2,
          0,
          Math.max(0, contentWidth - scrollViewWidth)
        );
        scrollViewRef.current.scrollTo({ x: targetX, animated: true });
      },
      [measuredChips, scrollViewWidth, contentWidth]
    );

    // ---------- effects ----------
    useEffect(() => {
      // re-measure whenever content or container width or number of options changes
      measureAll();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contentWidth, scrollViewWidth, options.length]);

    useEffect(() => {
      const idx = options.findIndex((o) => o.key === sortKey);
      if (idx >= 0) {
        if (measuredChips.length === options.length) {
          scrollToChipCentered(idx);
        } else {
          (async () => {
            await measureAll();
            await wait(20);
            scrollToChipCentered(idx);
          })();
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortKey]);

    // ---------- event handlers ----------
    const handleScrollViewLayout = useCallback((e: LayoutChangeEvent) => {
      const { width } = e.nativeEvent.layout;
      setScrollViewWidth(width);
    }, []);

    const handleContentSizeChange = useCallback((w: number /*, h*/) => {
      setContentWidth(w);
    }, []);

    const handleScroll = useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const x = event.nativeEvent.contentOffset.x;
        setScrollX(x);
      },
      []
    );

    // ---------- fades computation ----------
    // showLeft when scrolled away from start (with a small threshold)
    const showLeftFade = scrollX > 6;
    // showRight when content overflows and not scrolled to end
    const maxScroll = Math.max(0, contentWidth - scrollViewWidth);
    const showRightFade =
      contentWidth > scrollViewWidth && scrollX < maxScroll - 6;

    // ---------- render ----------
    if (!hasData) return null;

    const renderButton = (key: SortKey, label: string, idx: number) => (
      <View
        key={key}
        ref={(el) => {
          chipRefs.current[idx] = el;
        }}
        collapsable={false}
        style={{ alignSelf: "center" }}
      >
        <Button
          compact
          mode={sortKey === key ? "elevated" : "text"}
          onPress={() => onChangeSortKey(key)}
          style={sortKey === key ? activeChipStyle : baseButtonStyle}
          labelStyle={sortKey === key ? activeLabelStyle : inactiveLabelStyle}
          contentStyle={{ padding: 0 }}
          accessibilityRole="button"
          accessibilityState={{ selected: sortKey === key }}
        >
          {label}
        </Button>
      </View>
    );

    // fade colors
    const surface = theme.colors.surface ?? "#FFFFFF";
    const fadeOpaque =
      typeof surface === "string" && surface.startsWith("#")
        ? hexToRgba(surface, 1)
        : surface;
    const fadeTransparent =
      typeof surface === "string" && surface.startsWith("#")
        ? hexToRgba(surface, 0)
        : "transparent";

    return (
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "700",
            marginRight: 6,
            color: theme.colors.onSurface,
          }}
        >
          Sort:
        </Text>

        <View
          style={{ position: "relative", flex: 1 }}
          onLayout={handleScrollViewLayout}
        >
          {/* Scrollable chips */}
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            onContentSizeChange={handleContentSizeChange}
            scrollEventThrottle={16}
            contentContainerStyle={{
              alignItems: "center",
              paddingRight: tokens.spacing.sm,
              paddingLeft: tokens.spacing.xs,
            }}
          >
            {options.map((opt, idx) => renderButton(opt.key, opt.label, idx))}
          </ScrollView>

          {/* Left fade */}
          {showLeftFade && (
            <LinearGradient
              colors={[fadeOpaque, fadeTransparent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 20,
                pointerEvents: "none",
              }}
            />
          )}

          {/* Right fade */}
          {showRightFade && (
            <LinearGradient
              colors={[fadeTransparent, fadeOpaque]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: 20,
                pointerEvents: "none",
              }}
            />
          )}
        </View>
      </View>
    );
  }
);

SortControls.displayName = "SortControls";
export default SortControls;
