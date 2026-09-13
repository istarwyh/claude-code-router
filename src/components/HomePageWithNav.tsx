'use client';

import Link from 'next/link';
import { type CSSProperties, type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from 'react';
import { BrandLogo } from '@/components/brand';
import { AiWireframeSection } from '@/components/features/ai-wireframe/AiWireframeSection';
import { GetStartedSection } from '@/components/features/get-started/GetStartedSection';
import {
  DEFAULT_HOME_SECTION_ID,
  homeSectionFeatures,
  homeUtilityFeatures,
  isHomeSectionId,
  type HomeSectionId,
} from '@/config/features';
import { UI_TEXTS } from '@/config/ui-texts';

type MenuPosition = {
  x: number;
  y: number;
};

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  lastX: number;
  lastY: number;
  moved: boolean;
};

type MenuPlacement = {
  horizontal: 'left' | 'right';
  vertical: 'top' | 'bottom';
};

const MENU_STORAGE_KEY = 'aispeeds-homepage-menu-position';
const MENU_EDGE_PADDING = 16;
const MENU_HOVER_PADDING = 12;
const MENU_DRAG_THRESHOLD = 4;

function readHashSection(): HomeSectionId {
  const hashSection = window.location.hash.slice(1);
  return isHomeSectionId(hashSection) ? hashSection : DEFAULT_HOME_SECTION_ID;
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getStoredMenuPosition(): MenuPosition | null {
  try {
    const storedValue = window.localStorage.getItem(MENU_STORAGE_KEY);

    if (!storedValue) {
      return null;
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (typeof parsedValue !== 'object' || parsedValue === null) {
      return null;
    }

    const position = parsedValue as Record<string, unknown>;

    if (
      typeof position['x'] !== 'number' ||
      typeof position['y'] !== 'number' ||
      !Number.isFinite(position['x']) ||
      !Number.isFinite(position['y'])
    ) {
      return null;
    }

    return { x: position['x'], y: position['y'] };
  } catch {
    return null;
  }
}

function getDefaultMenuPosition(buttonElement: HTMLButtonElement | null): MenuPosition {
  const edgePadding = window.matchMedia('(min-width: 640px)').matches ? 24 : MENU_EDGE_PADDING;
  const buttonWidth = buttonElement?.offsetWidth ?? 96;

  return {
    x: window.innerWidth - buttonWidth - edgePadding,
    y: edgePadding,
  };
}

function clampMenuPosition(position: MenuPosition, buttonElement: HTMLButtonElement | null): MenuPosition {
  const buttonWidth = buttonElement?.offsetWidth ?? 96;
  const buttonHeight = buttonElement?.offsetHeight ?? 44;
  const maxX = Math.max(MENU_EDGE_PADDING, window.innerWidth - buttonWidth - MENU_EDGE_PADDING);
  const maxY = Math.max(MENU_EDGE_PADDING, window.innerHeight - buttonHeight - MENU_EDGE_PADDING);

  return {
    x: clampNumber(position.x, MENU_EDGE_PADDING, maxX),
    y: clampNumber(position.y, MENU_EDGE_PADDING, maxY),
  };
}

function getMenuPlacement(position: MenuPosition | null): MenuPlacement {
  if (typeof window === 'undefined' || !position) {
    return { horizontal: 'right', vertical: 'bottom' };
  }

  return {
    horizontal: position.x < window.innerWidth / 2 ? 'left' : 'right',
    vertical: position.y < window.innerHeight / 2 ? 'bottom' : 'top',
  };
}

function getMenuMaxHeight(
  position: MenuPosition | null,
  placement: MenuPlacement,
  buttonElement: HTMLButtonElement | null,
): number | undefined {
  if (typeof window === 'undefined' || !position) {
    return undefined;
  }

  const buttonHeight = buttonElement?.offsetHeight ?? 44;
  const menuSpacing = MENU_HOVER_PADDING + 4 + MENU_EDGE_PADDING;
  const availableHeight =
    placement.vertical === 'bottom'
      ? window.innerHeight - position.y - buttonHeight - menuSpacing
      : position.y - menuSpacing;

  return Math.max(0, availableHeight);
}

function storeMenuPosition(position: MenuPosition) {
  try {
    window.localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(position));
  } catch {
    return;
  }
}

export function HomePageWithNav() {
  const [activeSection, setActiveSection] = useState<HomeSectionId>(DEFAULT_HOME_SECTION_ID);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const [hoverEnabled, setHoverEnabled] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuShellRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const hoverCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ignoreClickAfterDragRef = useRef(false);
  const menuPlacement = getMenuPlacement(menuPosition);
  const menuMaxHeight = getMenuMaxHeight(menuPosition, menuPlacement, menuButtonRef.current);
  const menuShellStyle: CSSProperties | undefined = menuPosition
    ? {
        left: menuPosition.x - MENU_HOVER_PADDING,
        top: menuPosition.y - MENU_HOVER_PADDING,
      }
    : undefined;

  const clearHoverClose = () => {
    if (hoverCloseTimerRef.current === null) {
      return;
    }

    clearTimeout(hoverCloseTimerRef.current);
    hoverCloseTimerRef.current = null;
  };

  const openMenuFromHover = () => {
    if (!hoverEnabled || isDragging) {
      return;
    }

    clearHoverClose();
    setMenuOpen(true);
  };

  const closeMenuFromHover = () => {
    if (!hoverEnabled) {
      return;
    }

    clearHoverClose();
    hoverCloseTimerRef.current = setTimeout(() => {
      setMenuOpen(false);
      hoverCloseTimerRef.current = null;
    }, 180);
  };

  useEffect(() => {
    setActiveSection(readHashSection());

    const onHashChange = () => setActiveSection(readHashSection());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const initialPosition = getStoredMenuPosition() ?? getDefaultMenuPosition(menuButtonRef.current);
    setMenuPosition(clampMenuPosition(initialPosition, menuButtonRef.current));

    const onResize = () => {
      setMenuPosition(currentPosition =>
        clampMenuPosition(currentPosition ?? getDefaultMenuPosition(menuButtonRef.current), menuButtonRef.current),
      );
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const syncHoverSupport = () => setHoverEnabled(hoverQuery.matches);

    syncHoverSupport();
    hoverQuery.addEventListener('change', syncHoverSupport);
    return () => hoverQuery.removeEventListener('change', syncHoverSupport);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const closeOnOutsidePointerDown = (event: globalThis.PointerEvent) => {
      const target = event.target;

      if (target instanceof globalThis.Node && menuShellRef.current?.contains(target)) {
        return;
      }

      setMenuOpen(false);
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', closeOnOutsidePointerDown);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointerDown);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    return () => clearHoverClose();
  }, []);

  const handleMenuButtonClick = () => {
    if (ignoreClickAfterDragRef.current) {
      ignoreClickAfterDragRef.current = false;
      return;
    }

    setMenuOpen(current => !current);
  };

  const handleMenuPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) {
      return;
    }

    clearHoverClose();

    const origin =
      menuPosition ?? clampMenuPosition(getDefaultMenuPosition(menuButtonRef.current), menuButtonRef.current);
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: origin.x,
      originY: origin.y,
      lastX: origin.x,
      lastY: origin.y,
      moved: false,
    };
    setMenuPosition(origin);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleMenuPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;

    if (!dragState.moved && Math.hypot(deltaX, deltaY) < MENU_DRAG_THRESHOLD) {
      return;
    }

    dragState.moved = true;
    setIsDragging(true);
    setMenuOpen(false);

    const nextPosition = clampMenuPosition(
      { x: dragState.originX + deltaX, y: dragState.originY + deltaY },
      menuButtonRef.current,
    );
    dragState.lastX = nextPosition.x;
    dragState.lastY = nextPosition.y;
    setMenuPosition(nextPosition);
    event.preventDefault();
  };

  const finishMenuDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragStateRef.current = null;
    setIsDragging(false);

    if (!dragState.moved) {
      return;
    }

    const nextPosition = { x: dragState.lastX, y: dragState.lastY };
    ignoreClickAfterDragRef.current = true;
    storeMenuPosition(nextPosition);
  };

  const selectSection = (section: HomeSectionId, href: string) => {
    setActiveSection(section);
    setMenuOpen(false);
    window.history.pushState(null, '', href);
  };

  return (
    <div className='min-h-screen bg-bg-secondary text-text-primary'>
      {menuOpen && (
        <div
          aria-hidden='true'
          className='fixed inset-0 z-40 bg-transparent'
          onPointerDown={() => setMenuOpen(false)}
        />
      )}

      <div
        ref={menuShellRef}
        className={`fixed p-3 ${menuOpen ? 'z-50' : 'z-40'} ${menuPosition ? '' : 'right-1 top-1 sm:right-3 sm:top-3'}`}
        style={menuShellStyle}
        onMouseEnter={openMenuFromHover}
        onMouseLeave={closeMenuFromHover}
      >
        <button
          ref={menuButtonRef}
          type='button'
          aria-controls='homepage-menu'
          aria-expanded={menuOpen}
          aria-haspopup='true'
          aria-label={menuOpen ? UI_TEXTS.MENU.COLLAPSE : UI_TEXTS.MENU.EXPAND}
          onClick={handleMenuButtonClick}
          onFocus={() => {
            if (hoverEnabled) {
              setMenuOpen(true);
            }
          }}
          onPointerDown={handleMenuPointerDown}
          onPointerMove={handleMenuPointerMove}
          onPointerUp={finishMenuDrag}
          onPointerCancel={finishMenuDrag}
          className={`flex touch-none select-none items-center gap-2 rounded-pill border border-floating-border bg-floating-surface px-4 py-2 text-sm font-semibold text-text-primary shadow-floating backdrop-blur-floating transition hover:translate-y-lift hover:border-primary hover:bg-floating-surface-strong active:scale-press ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          <span className='h-2 w-2 rounded-full bg-primary shadow-primary-glow' />
          {UI_TEXTS.MENU.LABEL}
        </button>

        {menuOpen && (
          <nav
            id='homepage-menu'
            aria-label={UI_TEXTS.MENU.NAVIGATION_ARIA}
            className={`absolute w-[min(24rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-3xl border border-floating-border bg-floating-surface-strong p-4 shadow-floating-strong backdrop-blur-floating ${
              menuPlacement.horizontal === 'right' ? 'right-3' : 'left-3'
            } ${menuPlacement.vertical === 'bottom' ? 'top-full mt-1' : 'bottom-full mb-1'}`}
            style={{ maxHeight: menuMaxHeight }}
          >
            <div className='flex items-center justify-between gap-4'>
              <BrandLogo size='medium' />
              <button
                type='button'
                onClick={() => setMenuOpen(false)}
                className='rounded-full border border-border-light px-3 py-2 text-sm font-semibold text-text-secondary transition hover:border-primary hover:text-text-primary'
              >
                {UI_TEXTS.BUTTONS.CLOSE}
              </button>
            </div>
            <div className='mt-6 grid gap-2'>
              {homeSectionFeatures.map(item => (
                <button
                  key={item.id}
                  type='button'
                  aria-current={activeSection === item.id ? 'page' : undefined}
                  onClick={() => selectSection(item.id, item.href)}
                  className={`rounded-2xl px-4 py-3 text-left font-semibold transition ${
                    activeSection === item.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-bg-secondary text-text-primary hover:bg-bg-tertiary'
                  }`}
                >
                  {item.title}
                </button>
              ))}
              {homeUtilityFeatures.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className='rounded-2xl bg-bg-secondary px-4 py-3 font-semibold text-text-primary transition hover:bg-bg-tertiary'
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>

      <main className='min-h-screen'>
        {activeSection === 'home' ? (
          <Cc4pmHomepageFrame />
        ) : activeSection === 'get-started' ? (
          <GetStartedSection />
        ) : (
          <AiWireframeSection />
        )}
      </main>
    </div>
  );
}

function Cc4pmHomepageFrame() {
  return (
    <iframe
      src='/static/cc4pm-homepage.html'
      title='cc4pm 首页'
      className='block h-[100dvh] w-full border-0 bg-bg-primary'
    />
  );
}
