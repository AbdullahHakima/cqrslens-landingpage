import React from 'react';

interface IconProps {
  className?: string;
}

export const ChevronRightIcon: React.FC<IconProps> = ({ className = 'size-3.5' }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="square"
    strokeLinejoin="miter"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path d="M6 3.5L10.5 8L6 12.5" />
  </svg>
);

export const ArrowUpRightIcon: React.FC<IconProps> = ({ className = 'size-3.5' }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="square"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path d="M4.5 11.5L11.5 4.5M5.5 4.5H11.5V10.5" />
  </svg>
);

export const CopyIcon: React.FC<IconProps> = ({ className = 'size-3.5' }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <rect x="5.5" y="5.5" width="7.5" height="7.5" />
    <path d="M3 10.5V3H10.5" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ className = 'size-3.5' }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="square"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path d="M3.2 8.4L6.5 11.7L12.8 4.6" />
  </svg>
);

export const SonarPulseIcon: React.FC<IconProps> = ({ className = 'size-3.5' }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <circle cx="8" cy="8" r="1.8" fill="currentColor" stroke="none" />
    <path d="M4.6 4.6a4.8 4.8 0 0 0 0 6.8M11.4 4.6a4.8 4.8 0 0 1 0 6.8" />
    <path d="M2.4 2.8a7.6 7.6 0 0 0 0 10.4M13.6 2.8a7.6 7.6 0 0 1 0 10.4" />
  </svg>
);

export const MenuIcon: React.FC<IconProps> = ({ className = 'size-4' }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path d="M2 5H14M2 11H14" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ className = 'size-4' }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path d="M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5" />
  </svg>
);

export const GitHubIcon: React.FC<IconProps> = ({ className = 'size-3.5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

export const StarIcon: React.FC<IconProps> = ({ className = 'size-3.5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path d="M12 2.6l2.86 5.8 6.4.93-4.63 4.51 1.09 6.37L12 17.2l-5.72 3.01 1.09-6.37L2.74 9.33l6.4-.93L12 2.6z" />
  </svg>
);

export const NuGetIcon: React.FC<IconProps> = ({ className = 'size-3.5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path d="M1.998.342a1.997 1.997 0 1 0 0 3.995 1.997 1.997 0 0 0 0-3.995zm9.18 4.34a6.156 6.156 0 0 0-6.153 6.155v6.667c0 3.4 2.756 6.154 6.154 6.154h6.667c3.4 0 6.154-2.755 6.154-6.154v-6.667a6.154 6.154 0 0 0-6.154-6.155zm-1.477 2.8a2.496 2.496 0 1 1 0 4.993 2.496 2.496 0 0 1 0-4.993zm7.968 6.16a3.996 3.996 0 1 1-.002 7.992 3.996 3.996 0 0 1 .002-7.992z" />
  </svg>
);

export const BookOpenIcon: React.FC<IconProps> = ({ className = 'size-3.5' }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="square"
    strokeLinejoin="miter"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path d="M8 3.5C6.6 2.7 4.4 2.5 2 2.8V12.6C4.4 12.3 6.6 12.5 8 13.3M8 3.5C9.4 2.7 11.6 2.5 14 2.8V12.6C11.6 12.3 9.4 12.5 8 13.3M8 3.5V13.3" />
  </svg>
);

export const IssueSignalIcon: React.FC<IconProps> = ({ className = 'size-3.5' }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="square"
    strokeLinejoin="miter"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <rect x="2.25" y="2.5" width="11.5" height="9" />
    <path d="M5.5 11.5V14L8.5 11.5M5.5 6.25H10.5M5.5 8.5H8.5" />
  </svg>
);

export const ReleaseTagIcon: React.FC<IconProps> = ({ className = 'size-3.5' }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="square"
    strokeLinejoin="miter"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path d="M2.5 2.5H8.2L13.7 8L8 13.7L2.5 8.2V2.5Z" />
    <circle cx="5.4" cy="5.4" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ className = 'size-3.5' }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="square"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <circle cx="7" cy="7" r="4.25" />
    <path d="M10.25 10.25L13.5 13.5" />
  </svg>
);

export const TerminalIcon: React.FC<IconProps> = ({ className = 'size-3.5' }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="square"
    strokeLinejoin="miter"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <rect x="1.75" y="2.5" width="12.5" height="11" />
    <path d="M4.5 6L6.75 8L4.5 10M8.25 10H11.25" />
  </svg>
);

export const LinkAnchorIcon: React.FC<IconProps> = ({ className = 'size-3.5' }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="square"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path d="M6.5 9.5L9.5 6.5" />
    <path d="M8.8 4.4L10.4 2.8A2.4 2.4 0 0 1 13.8 6.2L12.2 7.8" />
    <path d="M7.2 11.6L5.6 13.2A2.4 2.4 0 0 1 2.2 9.8L3.8 8.2" />
  </svg>
);

export const ArrowLeftIcon: React.FC<IconProps> = ({ className = 'size-3.5' }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="square"
    strokeLinejoin="miter"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path d="M10 3.5L5.5 8L10 12.5" />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ className = 'size-3.5' }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="square"
    strokeLinejoin="miter"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path d="M3.5 6L8 10.5L12.5 6" />
  </svg>
);

/* ---------------------------------------------------------------------------
   Official brand marks for integration tabs (Simple Icons / vendor press kits)
   Rendered in currentColor so the marks inherit the tab's interaction state.
   --------------------------------------------------------------------------- */

export const ClaudeIcon: React.FC<IconProps> = ({ className = 'size-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="#D97757"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
  </svg>
);

export const CursorIcon: React.FC<IconProps> = ({ className = 'size-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23" />
  </svg>
);

export const VSCodeIcon: React.FC<IconProps> = ({ className = 'size-4' }) => {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const gradientId = `vscode-gradient-${uid}`;
  const shapeId = `vscode-shape-${uid}`;
  const maskId = `vscode-mask-${uid}`;

  return (
    <svg
      viewBox="0 0 256 254"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="50%" x2="50%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <path
          id={shapeId}
          d="M180.828 252.605a15.87 15.87 0 0 0 12.65-.486l52.501-25.262a15.94 15.94 0 0 0 9.025-14.364V41.197a15.94 15.94 0 0 0-9.025-14.363l-52.5-25.263a15.88 15.88 0 0 0-18.115 3.084L74.857 96.35l-43.78-33.232a10.614 10.614 0 0 0-13.56.603L3.476 76.494c-4.63 4.211-4.635 11.495-.012 15.713l37.967 34.638l-37.967 34.637c-4.623 4.219-4.618 11.502.012 15.714l14.041 12.772a10.614 10.614 0 0 0 13.56.604l43.78-33.233l100.507 91.695a15.85 15.85 0 0 0 5.464 3.571m10.464-183.649l-76.262 57.889l76.262 57.888z"
        />
      </defs>
      <mask id={maskId} fill="#fff">
        <use href={`#${shapeId}`} />
      </mask>
      <path
        fill="#0065a9"
        d="M246.135 26.873L193.593 1.575a15.885 15.885 0 0 0-18.123 3.08L3.466 161.482c-4.626 4.219-4.62 11.502.012 15.714l14.05 12.772a10.625 10.625 0 0 0 13.569.604L238.229 33.436c6.949-5.271 16.93-.315 16.93 8.407v-.61a15.94 15.94 0 0 0-9.024-14.36"
        mask={`url(#${maskId})`}
      />
      <path
        fill="#007acc"
        d="m246.135 226.816l-52.542 25.298a15.89 15.89 0 0 1-18.123-3.08L3.466 92.207c-4.626-4.218-4.62-11.502.012-15.713l14.05-12.773a10.625 10.625 0 0 1 13.569-.603l207.132 157.135c6.949 5.271 16.93.315 16.93-8.408v.611a15.94 15.94 0 0 1-9.024 14.36"
        mask={`url(#${maskId})`}
      />
      <path
        fill="#1f9cf0"
        d="M193.428 252.134a15.89 15.89 0 0 1-18.125-3.083c5.881 5.88 15.938 1.715 15.938-6.603V11.273c0-8.318-10.057-12.483-15.938-6.602a15.89 15.89 0 0 1 18.125-3.084l52.533 25.263a15.94 15.94 0 0 1 9.03 14.363V212.51c0 6.125-3.51 11.709-9.03 14.363z"
        mask={`url(#${maskId})`}
      />
      <path
        fill={`url(#${gradientId})`}
        fillOpacity=".25"
        d="M180.828 252.605a15.87 15.87 0 0 0 12.65-.486l52.5-25.263a15.94 15.94 0 0 0 9.026-14.363V41.197a15.94 15.94 0 0 0-9.025-14.363L193.477 1.57a15.88 15.88 0 0 0-18.114 3.084L74.857 96.35l-43.78-33.232a10.614 10.614 0 0 0-13.56.603L3.476 76.494c-4.63 4.211-4.635 11.495-.012 15.713l37.967 34.638l-37.967 34.637c-4.623 4.219-4.618 11.502.012 15.714l14.041 12.772a10.614 10.614 0 0 0 13.56.604l43.78-33.233l100.506 91.695a15.9 15.9 0 0 0 5.465 3.571m10.464-183.65l-76.262 57.89l76.262 57.888z"
        mask={`url(#${maskId})`}
      />
    </svg>
  );
};

export const AntigravityIcon: React.FC<IconProps> = ({ className = 'size-4' }) => {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const maskId = `antigravity-mask-${uid}`;
  const filterId = (index: number) => `antigravity-filter-${uid}-${index}`;

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <mask id={maskId} width="24" height="23" x="0" y="1" maskUnits="userSpaceOnUse">
        <path
          fill="#fff"
          d="M21.751 22.607c1.34 1.005 3.35.335 1.508-1.508C17.73 15.74 18.904 1 12.037 1 5.17 1 6.342 15.74.815 21.1c-2.01 2.009.167 2.511 1.507 1.506 5.192-3.517 4.857-9.714 9.715-9.714 4.857 0 4.522 6.197 9.714 9.715z"
        />
      </mask>
      <g mask={`url(#${maskId})`}>
        <g filter={`url(#${filterId(1)})`}>
          <path
            fill="#FFE432"
            d="M-1.018-3.992c-.408 3.591 2.686 6.89 6.91 7.37 4.225.48 7.98-2.043 8.387-5.633.408-3.59-2.686-6.89-6.91-7.37-4.225-.479-7.98 2.043-8.387 5.633z"
          />
        </g>
        <g filter={`url(#${filterId(2)})`}>
          <path
            fill="#FC413D"
            d="M15.269 7.747c1.058 4.557 5.691 7.374 10.348 6.293 4.657-1.082 7.575-5.653 6.516-10.21-1.058-4.556-5.691-7.374-10.348-6.292-4.657 1.082-7.575 5.653-6.516 10.21z"
          />
        </g>
        <g filter={`url(#${filterId(3)})`}>
          <path
            fill="#00B95C"
            d="M-12.443 10.804c1.338 4.703 7.36 7.11 13.453 5.378 6.092-1.733 9.947-6.95 8.61-11.652C8.282-.173 2.26-2.58-3.833-.848-9.925.884-13.78 6.1-12.443 10.804z"
          />
        </g>
        <g filter={`url(#${filterId(4)})`}>
          <path
            fill="#00B95C"
            d="M-12.443 10.804c1.338 4.703 7.36 7.11 13.453 5.378 6.092-1.733 9.947-6.95 8.61-11.652C8.282-.173 2.26-2.58-3.833-.848-9.925.884-13.78 6.1-12.443 10.804z"
          />
        </g>
        <g filter={`url(#${filterId(5)})`}>
          <path
            fill="#00B95C"
            d="M-7.608 14.703c3.352 3.424 9.126 3.208 12.896-.483 3.77-3.69 4.108-9.459.756-12.883C2.69-2.087-3.083-1.871-6.853 1.82c-3.77 3.69-4.108 9.458-.755 12.883z"
          />
        </g>
        <g filter={`url(#${filterId(6)})`}>
          <path
            fill="#3186FF"
            d="M9.932 27.617c1.04 4.482 5.384 7.303 9.7 6.3 4.316-1.002 6.971-5.448 5.93-9.93-1.04-4.483-5.384-7.304-9.7-6.301-4.316 1.002-6.971 5.448-5.93 9.93z"
          />
        </g>
        <g filter={`url(#${filterId(7)})`}>
          <path
            fill="#FBBC04"
            d="M2.572-8.185C.392-3.329 2.778 2.472 7.9 4.771c5.122 2.3 11.042.227 13.222-4.63 2.18-4.855-.205-10.656-5.327-12.955-5.122-2.3-11.042-.227-13.222 4.63z"
          />
        </g>
        <g filter={`url(#${filterId(8)})`}>
          <path
            fill="#3186FF"
            d="M-3.267 38.686c-5.277-2.072 3.742-19.117 5.984-24.83 2.243-5.712 8.34-8.664 13.616-6.592 5.278 2.071 11.533 13.482 9.29 19.195-2.242 5.713-23.613 14.298-28.89 12.227z"
          />
        </g>
        <g filter={`url(#${filterId(9)})`}>
          <path
            fill="#749BFF"
            d="M28.71 17.471c-1.413 1.649-5.1.808-8.236-1.878-3.135-2.687-4.531-6.201-3.118-7.85 1.412-1.649 5.1-.808 8.235 1.878s4.532 6.2 3.119 7.85z"
          />
        </g>
        <g filter={`url(#${filterId(10)})`}>
          <path
            fill="#FC413D"
            d="M18.163 9.077c5.81 3.93 12.502 4.19 14.946.577 2.443-3.612-.287-9.727-6.098-13.658-5.81-3.931-12.502-4.19-14.946-.577-2.443 3.612.287 9.727 6.098 13.658z"
          />
        </g>
        <g filter={`url(#${filterId(11)})`}>
          <path
            fill="#FFEE48"
            d="M-.915 2.684c-1.44 3.473-.97 6.967 1.05 7.804 2.02.837 4.824-1.3 6.264-4.772 1.44-3.473.97-6.967-1.05-7.804-2.02-.837-4.824 1.3-6.264 4.772z"
          />
        </g>
      </g>
      <defs>
        <filter
          id={filterId(1)}
          width="19.838"
          height="17.587"
          x="-3.288"
          y="-11.917"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="1.117" />
        </filter>
        <filter
          id={filterId(2)}
          width="38.9"
          height="38.565"
          x="4.251"
          y="-13.493"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="5.4" />
        </filter>
        <filter
          id={filterId(3)}
          width="40.955"
          height="36.517"
          x="-21.889"
          y="-10.592"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="4.591" />
        </filter>
        <filter
          id={filterId(4)}
          width="40.955"
          height="36.517"
          x="-21.889"
          y="-10.592"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="4.591" />
        </filter>
        <filter
          id={filterId(5)}
          width="36.632"
          height="36.595"
          x="-19.099"
          y="-10.278"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="4.591" />
        </filter>
        <filter
          id={filterId(6)}
          width="33.533"
          height="34.087"
          x=".981"
          y="8.758"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="4.363" />
        </filter>
        <filter
          id={filterId(7)}
          width="35.978"
          height="35.276"
          x="-6.143"
          y="-21.659"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="3.954" />
        </filter>
        <filter
          id={filterId(8)}
          width="45.114"
          height="46.523"
          x="-11.96"
          y="-.46"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="3.531" />
        </filter>
        <filter
          id={filterId(9)}
          width="25.094"
          height="24.054"
          x="10.485"
          y=".58"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="3.159" />
        </filter>
        <filter
          id={filterId(10)}
          width="33.508"
          height="30.007"
          x="5.833"
          y="-12.467"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="2.669" />
        </filter>
        <filter
          id={filterId(11)}
          width="22.194"
          height="26.151"
          x="-8.355"
          y="-8.876"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="3.303" />
        </filter>
      </defs>
    </svg>
  );
};

export const FileTextIcon: React.FC<IconProps> = ({ className = 'size-4' }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="square"
    strokeLinejoin="miter"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path d="M3.5 1.75H9.5L12.5 4.75V14.25H3.5V1.75Z" />
    <path d="M9.25 1.9V5H12.4M5.75 8H10.25M5.75 10.5H9" />
  </svg>
);

export const GitHubActionsIcon: React.FC<IconProps> = ({ className = 'size-4' }) => (
  <svg
    viewBox="0 0 128 128"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      fill="#2088ff"
      d="M26.666 0C11.97 0 0 11.97 0 26.666c0 12.87 9.181 23.651 21.334 26.13v37.87c0 11.77 9.68 21.334 21.332 21.334h.195c1.302 9.023 9.1 16 18.473 16C71.612 128 80 119.612 80 109.334s-8.388-18.668-18.666-18.668c-9.372 0-17.17 6.977-18.473 16h-.195c-8.737 0-16-7.152-16-16V63.779a18.5 18.5 0 0 0 13.24 5.555h2.955c1.303 9.023 9.1 16 18.473 16s17.169-6.977 18.47-16h11.057c1.303 9.023 9.1 16 18.473 16c10.278 0 18.666-8.39 18.666-18.668S119.612 48 109.334 48c-9.373 0-17.171 6.977-18.473 16H79.805c-1.301-9.023-9.098-16-18.471-16s-17.171 6.977-18.473 16h-2.955c-6.433 0-11.793-4.589-12.988-10.672c14.58-.136 26.416-12.05 26.416-26.662C53.334 11.97 41.362 0 26.666 0m0 5.334A21.29 21.29 0 0 1 48 26.666A21.294 21.294 0 0 1 26.666 48A21.29 21.29 0 0 1 5.334 26.666A21.29 21.29 0 0 1 26.666 5.334m-5.215 7.541C18.67 12.889 16 15.123 16 18.166v17.043c0 4.043 4.709 6.663 8.145 4.533l13.634-8.455c3.257-2.02 3.274-7.002.032-9.045l-13.635-8.59a5 5 0 0 0-2.725-.777m-.117 5.291l13.635 8.588l-13.635 8.455zm40 35.168a13.29 13.29 0 0 1 13.332 13.332A13.293 13.293 0 0 1 61.334 80A13.294 13.294 0 0 1 48 66.666a13.293 13.293 0 0 1 13.334-13.332m48 0a13.29 13.29 0 0 1 13.332 13.332A13.293 13.293 0 0 1 109.334 80A13.294 13.294 0 0 1 96 66.666a13.293 13.293 0 0 1 13.334-13.332m-42.568 6.951a2.67 2.67 0 0 0-1.887.78l-6.3 6.294l-2.093-2.084a2.667 2.667 0 0 0-3.771.006a2.667 2.667 0 0 0 .008 3.772l3.974 3.96a2.667 2.667 0 0 0 3.766-.001l8.185-8.174a2.667 2.667 0 0 0 .002-3.772a2.67 2.67 0 0 0-1.884-.78zm48 0a2.67 2.67 0 0 0-1.887.78l-6.3 6.294l-2.093-2.084a2.667 2.667 0 0 0-3.771.006a2.667 2.667 0 0 0 .008 3.772l3.974 3.96a2.667 2.667 0 0 0 3.766-.001l8.185-8.174a2.667 2.667 0 0 0 .002-3.772a2.67 2.67 0 0 0-1.884-.78zM61.334 96a13.293 13.293 0 0 1 13.332 13.334a13.29 13.29 0 0 1-13.332 13.332A13.293 13.293 0 0 1 48 109.334A13.294 13.294 0 0 1 61.334 96M56 105.334c-2.193 0-4 1.807-4 4c0 2.195 1.808 4 4 4s4-1.805 4-4c0-2.193-1.807-4-4-4m10.666 0c-2.193 0-4 1.807-4 4c0 2.195 1.808 4 4 4s4-1.805 4-4c0-2.193-1.807-4-4-4M56 108c.75 0 1.334.585 1.334 1.334c0 .753-.583 1.332-1.334 1.332c-.75 0-1.334-.58-1.334-1.332c0-.75.585-1.334 1.334-1.334m10.666 0c.75 0 1.334.585 1.334 1.334c0 .753-.583 1.332-1.334 1.332c-.75 0-1.332-.58-1.332-1.332c0-.75.583-1.334 1.332-1.334"
    />
    <path
      fill="#79b8ff"
      d="M109.334 90.666c-9.383 0-17.188 6.993-18.477 16.031a3 3 0 0 0-.265-.011l-2.7.09a2.667 2.667 0 0 0-2.578 2.751a2.667 2.667 0 0 0 2.752 2.578l2.7-.087l.097-.006C92.17 121.029 99.965 128 109.334 128c10.278 0 18.666-8.388 18.666-18.666s-8.388-18.668-18.666-18.668m0 5.334a13.293 13.293 0 0 1 13.332 13.334a13.29 13.29 0 0 1-13.332 13.332A13.293 13.293 0 0 1 96 109.334A13.294 13.294 0 0 1 109.334 96"
    />
  </svg>
);

export const AzureDevOpsIcon: React.FC<IconProps> = ({ className = 'size-4' }) => {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const gradientId = `azure-gradient-${uid}`;

  return (
    <svg
      viewBox="0 0 128 128"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="9"
          x2="9"
          y1="16.97"
          y2="1.03"
          gradientTransform="scale(7.11111)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#0078d4" />
          <stop offset=".16" stopColor="#1380da" />
          <stop offset=".53" stopColor="#3c91e5" />
          <stop offset=".82" stopColor="#559cec" />
          <stop offset="1" stopColor="#5ea0ef" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradientId})`}
        d="M120.89 28.445v69.262l-28.445 23.324l-44.09-16.07v15.93L23.395 88.25l72.746 5.688V31.574ZM96.64 31.93L55.82 7.11v16.285L18.348 34.418L7.109 48.852v32.785l16.075 7.11V46.718Zm0 0"
      />
    </svg>
  );
};

export const GitLabIcon: React.FC<IconProps> = ({ className = 'size-4' }) => (
  <svg
    viewBox="0 0 128 128"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      fill="#e24329"
      d="m124.755 51.382l-.177-.452L107.47 6.282a4.46 4.46 0 0 0-1.761-2.121a4.58 4.58 0 0 0-5.236.281a4.6 4.6 0 0 0-1.518 2.304L87.404 42.088H40.629L29.077 6.746a4.5 4.5 0 0 0-1.518-2.31a4.58 4.58 0 0 0-5.236-.281a4.5 4.5 0 0 0-1.761 2.121L3.422 50.904l-.17.452c-5.059 13.219-.763 28.192 10.537 36.716l.059.046l.157.111l26.061 19.516l12.893 9.758l7.854 5.93a5.28 5.28 0 0 0 6.388 0l7.854-5.93l12.893-9.758l26.218-19.634l.065-.052c11.273-8.526 15.562-23.472 10.524-36.677"
    />
    <path
      fill="#fc6d26"
      d="m124.755 51.382l-.177-.452a57.8 57.8 0 0 0-23.005 10.341L64 89.682c12.795 9.68 23.934 18.09 23.934 18.09l26.218-19.634l.065-.052c11.291-8.527 15.586-23.488 10.538-36.704"
    />
    <path
      fill="#fca326"
      d="m40.066 107.771l12.893 9.758l7.854 5.93a5.28 5.28 0 0 0 6.388 0l7.854-5.93l12.893-9.758s-11.152-8.436-23.947-18.09a18379 18379 0 0 0-23.935 18.09"
    />
    <path
      fill="#fc6d26"
      d="M26.42 61.271A57.7 57.7 0 0 0 3.422 50.904l-.17.452c-5.059 13.219-.763 28.192 10.537 36.716l.059.046l.157.111l26.061 19.516L64 89.655z"
    />
  </svg>
);
