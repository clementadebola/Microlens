import React, { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";

const PaletteStyles = styled.div`
  .palette-1 {
    --bg-0: #101030;
    --bg-1: #050515;
    --blob-1: #984ddf;
    --blob-2: #4344ad;
    --blob-3: #74d9e1;
    --blob-4: #050515;
  }

  .palette-2 {
    --bg-0: #545454;
    --bg-1: #150513;
    --blob-1: #ff3838;
    --blob-2: #ff9d7c;
    --blob-3: #ffdda0;
    --blob-4: #fff6ea;
  }

  .palette-3 {
    --bg-0: #300030;
    --bg-1: #000000;
    --blob-1: #291528;
    --blob-2: #3a3e3b;
    --blob-3: #9e829c;
    --blob-4: #f0eff4;
  }

  .palette-4 {
    --bg-0: #ffffff;
    --bg-1: #d3f7ff;
    --blob-1: #bb74ff;
    --blob-2: #7c7dff;
    --blob-3: #a0f8ff;
    --blob-4: #ffffff;
  }

  .palette-5 {
    --bg-0: #968e85;
    --bg-1: #8cc084;
    --blob-1: #c1d7ae;
    --blob-2: #9eff72;
    --blob-3: #ffcab1;
    --blob-4: #ecdcb0;
  }

  .palette-6 {
    --bg-0: #ffffff;
    --bg-1: #4e598c;
    --blob-1: #ff8c42;
    --blob-2: #fcaf58;
    --blob-3: #f9c784;
    --blob-4: #ffffff;
  }
`;
const Druid = () => {
  const [currentPalette, setCurrentPalette] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPalette((prevPalette) => (prevPalette % 6) + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <BlobRenderer className={`palette-${currentPalette}`}>
        <BlobContainer>
          <svg viewBox="0 0 1200 1200">
            <g className="blob blob-1">
              <path d="M 100 600 q 0 -500, 500 -500 t 500 500 t -500 500 T 100 600 z" />
            </g>
            <g className="blob blob-2">
              <path d="M 100 600 q -50 -400, 500 -500 t 450 550 t -500 500 T 100 600 z" />
            </g>
            <g className="blob blob-3">
              <path d="M 100 600 q 0 -400, 500 -500 t 400 500 t -500 500 T 100 600 z" />
            </g>
            <g className="blob blob-4">
              <path d="M 150 600 q 0 -600, 500 -500 t 500 550 t -500 500 T 150 600 z" />
            </g>
            <g className="blob blob-1 alt">
              <path d="M 100 600 q 0 -500, 500 -500 t 500 500 t -500 500 T 100 600 z" />
            </g>
            <g className="blob blob-2 alt">
              <path d="M 100 600 q -50 -400, 500 -500 t 450 550 t -500 500 T 100 600 z" />
            </g>
            <g className="blob blob-3 alt">
              <path d="M 100 600 q 0 -400, 500 -500 t 400 500 t -500 500 T 100 600 z" />
            </g>
            <g className="blob blob-4 alt">
              <path d="M 150 600 q 0 -600, 500 -500 t 500 550 t -500 500 T 150 600 z" />
            </g>
          </svg>
        </BlobContainer>
      </BlobRenderer>
      <PaletteStyles />
    </>
  );
};

export default Druid;

const BlobRenderer = styled.div`
  height: 200px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 1000ms ease;

  &.palette-1 {
    --bg-0: #101030;
    --bg-1: #050515;
    --blob-1: #984ddf;
    --blob-2: #4344ad;
    --blob-3: #74d9e1;
    --blob-4: #050515;
  }

  &.palette-2 {
    --bg-0: #545454;
    --bg-1: #150513;
    --blob-1: #ff3838;
    --blob-2: #ff9d7c;
    --blob-3: #ffdda0;
    --blob-4: #fff6ea;
  }

  &.palette-3 {
    --bg-0: #300030;
    --bg-1: #000000;
    --blob-1: #291528;
    --blob-2: #3a3e3b;
    --blob-3: #9e829c;
    --blob-4: #f0eff4;
  }

  &.palette-4 {
    --bg-0: #ffffff;
    --bg-1: #d3f7ff;
    --blob-1: #bb74ff;
    --blob-2: #7c7dff;
    --blob-3: #a0f8ff;
    --blob-4: #ffffff;
  }

  &.palette-5 {
    --bg-0: #968e85;
    --bg-1: #8cc084;
    --blob-1: #c1d7ae;
    --blob-2: #9eff72;
    --blob-3: #ffcab1;
    --blob-4: #ecdcb0;
  }

  &.palette-6 {
    --bg-0: #ffffff;
    --bg-1: #4e598c;
    --blob-1: #ff8c42;
    --blob-2: #fcaf58;
    --blob-3: #f9c784;
    --blob-4: #ffffff;
  }

`;

const BlobContainer = styled.div`
  width: min(60vw, 60vh);
  height: min(60vw, 60vh);
  max-height: 100%;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    position: relative;
    height: 100%;
    z-index: 2;
  }

  .blob {
    animation: rotate 25s infinite alternate ease-in-out;
    transform-origin: 50% 50%;
    opacity: 0.7;

    path {
      animation: blob-anim-1 5s infinite alternate
        cubic-bezier(0.45, 0.2, 0.55, 0.8);
      transform-origin: 50% 50%;
      transform: scale(0.8);
      transition: fill 800ms ease;
    }

    &.alt {
      animation-direction: alternate-reverse;
      opacity: 0.3;
    }
  }

  .blob-1 {
    path {
      fill: var(--blob-1);
      filter: blur(1rem);
    }
  }

  .blob-2 {
    animation-duration: 18s;
    animation-direction: alternate-reverse;

    path {
      fill: var(--blob-2);
      animation-name: blob-anim-2;
      animation-duration: 7s;
      filter: blur(0.75rem);
      transform: scale(0.78);
    }

    &.alt {
      animation-direction: alternate;
    }
  }

  .blob-3 {
    animation-duration: 23s;

    path {
      fill: var(--blob-3);
      animation-name: blob-anim-3;
      animation-duration: 6s;
      filter: blur(0.5rem);
      transform: scale(0.76);
    }
  }

  .blob-4 {
    animation-duration: 31s;
    animation-direction: alternate-reverse;
    opacity: 0.9;

    path {
      fill: var(--blob-4);
      animation-name: blob-anim-4;
      animation-duration: 10s;
      filter: blur(10rem);
      transform: scale(0.5);
    }

    &.alt {
      animation-direction: alternate;
      opacity: 0.8;
    }
  }

  @keyframes blob-anim-1 {
    0% {
      d: path("M 100 600 q 0 -500, 500 -500 t 500 500 t -500 500 T 100 600 z");
    }
    30% {
      d: path(
        "M 100 600 q -50 -400, 500 -500 t 450 550 t -500 500 T 100 600 z"
      );
    }
    70% {
      d: path("M 100 600 q 0 -400, 500 -500 t 400 500 t -500 500 T 100 600 z");
    }
    100% {
      d: path("M 150 600 q 0 -600, 500 -500 t 500 550 t -500 500 T 150 600 z");
    }
  }

  @keyframes blob-anim-2 {
    0% {
      d: path("M 100 600 q 0 -400, 500 -500 t 400 500 t -500 500 T 100 600 z");
    }
    40% {
      d: path("M 150 600 q 0 -600, 500 -500 t 500 550 t -500 500 T 150 600 z");
    }
    80% {
      d: path(
        "M 100 600 q -50 -400, 500 -500 t 450 550 t -500 500 T 100 600 z"
      );
    }
    100% {
      d: path(
        "M 100 600 q 100 -600, 500 -500 t 400 500 t -500 500 T 100 600 z"
      );
    }
  }

  @keyframes blob-anim-3 {
    0% {
      d: path(
        "M 100 600 q -50 -400, 500 -500 t 450 550 t -500 500 T 100 600 z"
      );
    }
    35% {
      d: path("M 150 600 q 0 -600, 500 -500 t 500 550 t -500 500 T 150 600 z");
    }
    75% {
      d: path("M 150 600 q 0 -600, 500 -500 t 500 550 t -500 500 T 150 600 z");
    }
    100% {
      d: path("M 100 600 q 0 -400, 500 -500 t 400 500 t -500 500 T 100 600 z");
    }
  }

  @keyframes blob-anim-4 {
    0% {
      d: path("M 150 600 q 0 -600, 500 -500 t 500 550 t -500 500 T 150 600 z");
    }
    30% {
      d: path(
        "M 100 600 q 100 -600, 500 -500 t 400 500 t -500 500 T 100 600 z"
      );
    }
    70% {
      d: path(
        "M 100 600 q -50 -400, 500 -500 t 450 550 t -500 500 T 100 600 z"
      );
    }
    100% {
      d: path("M 150 600 q 0 -600, 500 -500 t 500 550 t -500 500 T 150 600 z");
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
