import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import styled, { keyframes } from "styled-components";
import { useSpring, animated } from "react-spring";
import {
  FaCamera,
  FaTimes,
  FaSearch,
  FaInfoCircle,
  FaCog,
  FaArrowLeft,
  FaTrash,
} from "react-icons/fa";
import { helix, mirage } from "ldrs";
import { MdPermMedia } from "react-icons/md";
import { IoIosFlashOff, IoIosFlash } from "react-icons/io";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { axiosInstance } from "./utils";
import OrganismDetails from "./OrganismDetails";
import { useNavigate } from "react-router-dom";
import Bot from "./bot/main";
import { IScannedResult } from "./types";
import { useAuth } from "./context/authContext";
import localforage from "localforage";
import Div100vh from 'react-div-100vh'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 600px;
  background-color: ${(props) => props.theme.colors.background};
  color: #fff;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
`;

const CameraView = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ScannerFocus = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 65%;
  height: 40%;
  border-radius: 20px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  z-index: 10;
`;

const ScannerCorner = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  border: 2px solid white;
  border-radius: 5px;
`;

const TopLeft = styled(ScannerCorner)`
  top: -2px;
  left: -2px;
  border-right: none;
  border-bottom: none;
`;

const TopRight = styled(ScannerCorner)`
  top: -2px;
  right: -2px;
  border-left: none;
  border-bottom: none;
`;

const BottomLeft = styled(ScannerCorner)`
  bottom: -2px;
  left: -2px;
  border-right: none;
  border-top: none;
`;

const BottomRight = styled(ScannerCorner)`
  bottom: -2px;
  right: -2px;
  border-left: none;
  border-top: none;
`;

const ControlsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  z-index: 20;
`;

const IconButton = styled.button`
  position: relative;
  z-index: 100;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  border: none;
  outline: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 20px;
`;

const CaptureButtonContainer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
`;

const CaptureButton = styled(IconButton)`
  width: 80px;
  height: 80px;
  background-color: #fff;
  color: #000;
  position: absolute;
  top: 0;
  left: 0;
`;

const progressAnimation = keyframes`
  from {
    stroke-dashoffset: 283;
  }
  to {
    stroke-dashoffset: 0;
  }
`;

const ProgressCircle = styled.svg`
  width: 80px;
  height: 80px;
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-90deg);
`;

const ProgressPath = styled.circle<{ $duration: number }>`
  fill: none;
  stroke: ${(props) => props.theme.colors.primary};
  stroke-width: 6;
  stroke-linecap: round;
  stroke-dasharray: 283;
  stroke-dashoffset: 283;
  animation: ${progressAnimation} ${(props) => props.$duration}ms linear forwards;
`;

const ResultImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
`;

const ResultTitle = styled.h2`
  margin: 20px 0 10px;
  font-size: 24px;
  color: #fff;
`;

const CloseButton = styled(IconButton)`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  cursor: pointer;
  color: #ffffff;
  font-size: 18px;
  margin-top: 5px;
  margin-bottom:10px;
  z-index: 1001;
`;
const CloseButtonH = styled.button`
position:absolute;
z-index:50;
width: 30px;
height: 30px;
display: flex;
align-items: center;
justify-content: center;
background-color: transparent;
cursor: pointer;
color: #ffffff;
font-size: 18px;
margin-top: 10px;
margin-bottom: 20px;
`;
const TriggerCont = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  align-items: flex-end;
  z-index: 30;

  .trigger-btn-wrap {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 25px;
    display: flex;
    flex-direction: column-reverse;
    gap: 4px;
    width: fit-content;
  }
`;

const TriggerButton = styled(IconButton)`
  background: transparent;
  width: 40px;
  height: 40px;
`;

const HistoryItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.colors.primary};
  border-radius: 5px;
  position: relative;
  &:hover {
    transform: scale(1.01);
    transition: 0.3s ease-out;
  }
`;

const HistoryImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 20px;
  border-radius: 5px;
`;

const SearchBar = styled.input`
  width: 95%;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${(props) => props.theme.colors.secondary};
  padding: 20px;
  border-radius: 10px;
  color: #ffffff;
  max-width: 90%;
  max-height: 80%;
  overflow-y: auto;
`;

const RemoveButton = styled(IconButton)`
  width: 25px;
  height: 25px;
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(255, 0, 0, 0.7);
`;

const AnimatedPage = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => props.theme.colors.background};
  padding: 20px;
  overflow-y: auto;
  z-index: 50;
`;

const SettingItem = styled.div`
  margin-bottom: 20px;
`;

const SettingLabel = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const SettingInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.colors.primary};
`;

const Scanner: React.FC = () => {
  const { currentUser } = useAuth();
  const [isScanning, setIsScanning] = useState(true);
  const [scannedResult, setScannedResult] = useState<IScannedResult | null>(null);
  const [capturedImage, setCapturedImage] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [triggerActive, setTriggerActive] = useState(false);
  const [scanHistory, setScanHistory] = useState<IScannedResult[]>([]);
  const [autoScanInterval, setAutoScanInterval] = useState(2000);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [resultLoading, setResultLoading] = useState<boolean>(false);
  const [isFlashEnabled, setIsFlashEnabled] = useState(false);
  const [resultSaveLoading, setResultSaveLoading] = useState(false);

  const STORAGE_KEY = "scanHistory";

  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser?.email) {
      navigate("/auth");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    helix.register();
    mirage.register();
  }, []);

  useEffect(() => {
    const hasShownModal = localStorage.getItem("M_GUIDE");
    if (hasShownModal === "true") {
      setShowModal(false);
    } else {
      setShowModal(true);
      localStorage.setItem("M_GUIDE", "true");
    }
  }, []);

  useEffect(() => {
    if (!showHistory && !showResult && !showModal && !showSettings) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [showHistory, showResult, showModal, showSettings]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (triggerActive && isScanning) {
      interval = setInterval(() => {
        captureImage();
      }, autoScanInterval);
    }
    return () => clearInterval(interval);
  }, [triggerActive, isScanning, autoScanInterval]);

  useEffect(() => {
    const getHistory = async () => {
      try {
        const scans = await localforage.getItem<IScannedResult[]>(STORAGE_KEY);
        setScanHistory(scans || []);
      } catch (err: any) {
        toast.error("Failed to fetch scans");
      }
    };
    getHistory();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();

    reader.onload = async () => {
      if (reader.readyState === 2) {
        setCapturedImage(reader.result as string);
        reader.result && await analyze(reader.result as string);
      }
    };

    if (e.target.files && e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const cropImage = (
    imageSrc: string,
    aspectRatio: number
  ): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        const sourceWidth = img.width;
        const sourceHeight = img.height;

        const targetWidth = sourceWidth;
        const targetHeight = sourceWidth / aspectRatio;

        const sourceY = (sourceHeight - targetHeight) / 2;

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        ctx.drawImage(
          img,
          0,
          sourceY,
          sourceWidth,
          targetHeight,
          0,
          0,
          targetWidth,
          targetHeight
        );

        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.src = imageSrc;
    });
  };

  const captureImage = async () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
      const imageDataUrl = canvas.toDataURL("image/jpeg");

      const croppedImage = await cropImage(imageDataUrl, 16 / 9);
      setCapturedImage(croppedImage);
      await analyze(croppedImage);
    }
  };

  const startFocusing = () => {
    setIsAnimating(true);
    setTimeout(async () => {
      await captureImage();
      setIsAnimating(false);
    }, autoScanInterval);
  };

  const toggleFlash = async () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (
        videoRef.current.srcObject as MediaStream
      ).getVideoTracks();
      if (tracks.length > 0) {
        const track = tracks[0];
        const capabilities = track.getCapabilities();
        if ("torch" in capabilities) {
          try {
            await track.applyConstraints({
              advanced: [{ torch: !isFlashEnabled }],
            });
            setIsFlashEnabled(!isFlashEnabled);
          } catch (err: any) {
            toast.error(err.message);
          }
        } else {
          toast.error("Torch not supported by the camera.");
        }
      }
    }
  };

  const analyze = async (image: string) => {
    try {
      setResultLoading(true);
      setShowResult(true);
      const { data }: { data: IScannedResult } = await axiosInstance.post(
        "/predict",
        {
          image,
        }
      );
      setResultLoading(false);
      const response = {
        ...data,
        id: uuidv4(),
        timestamp: new Date(),
      };

      setScannedResult(response);
    } catch (err: any) {
      setResultLoading(false);
      toast.error(err?.message);
    }
  };

  const resetScanner = () => {
    setShowResult(false);
    setScannedResult(null);
    setCapturedImage("");
  };

  const saveToHistory = async (object: IScannedResult) => {
    try {
      if (capturedImage && object?.prediction) {
        setResultSaveLoading(true);
        const existingHistory: IScannedResult[] =
          (await localforage.getItem(STORAGE_KEY)) || [];

        const updatedHistory = [...existingHistory];
        const existingIndex = updatedHistory.findIndex(
          (item: IScannedResult) => item?.id === object.id
        );

        if (existingIndex !== -1) {
          updatedHistory[existingIndex] = { ...object, image: capturedImage };
        } else {
          updatedHistory.push({ ...object, image: capturedImage });
        }

        await localforage.setItem(STORAGE_KEY, updatedHistory);

        setScanHistory(updatedHistory);
        setResultSaveLoading(false);
        toast.success("Saved successfully!");
      }
    } catch (err: any) {
      setResultSaveLoading(false);
      toast.error(err.message);
    }
  };

  const removeFromHistory = async (id: string) => {
    try {
      const existingHistory: IScannedResult[] =
        (await localforage.getItem(STORAGE_KEY)) || [];
      const updatedHistory = existingHistory.filter((item) => item.id !== id);
      await localforage.setItem(STORAGE_KEY, updatedHistory);
      setScanHistory(updatedHistory);
      toast.success("Scan deleted successfully");
      setShowResult(false);
    } catch (err: any) {
      toast.error("Failed to delete scan");
    }
  };

  useEffect(() => {
    if (searchTerm) {
      setScanHistory(
        scanHistory.filter((item: IScannedResult) =>
          item?.prediction?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, scanHistory]);

  const settingsAnimation = useSpring({
    transform: showSettings ? "translateY(0%)" : "translateY(100%)",
  });

  const historyAnimation = useSpring({
    transform: showHistory ? "translateX(0%)" : "translateX(100%)",
  });

  const resultsAnimation = useSpring({
    opacity: showResult ? 1 : 0,
    transform: showResult ? "translateY(0%)" : "translateY(100%)",
  });

  return (

    <Div100vh>
<Container>
      {isScanning && !showSettings && !showHistory ? (
        <CameraView>
          <CloseButtonH onClick={() => navigate("/")}>
            <FaArrowLeft color="#ccc" size={22} />
          </CloseButtonH>
          <Video ref={videoRef} autoPlay playsInline />
          <ScannerFocus>
            <TopLeft />
            <TopRight />
            <BottomLeft />
            <BottomRight />
          </ScannerFocus>
          <TriggerCont>
            <div className="trigger-btn-wrap">
              <TriggerButton onClick={() => setShowModal(true)}>
                <FaInfoCircle size={22} />
              </TriggerButton>
              <TriggerButton onClick={() => setShowHistory(true)}>
                <FaSearch size={20} />
              </TriggerButton>
              <TriggerButton onClick={toggleFlash}>
                {isFlashEnabled ? (
                  <IoIosFlash size={22} />
                ) : (
                  <IoIosFlashOff size={22} />
                )}
              </TriggerButton>
            </div>
          </TriggerCont>
          <ControlsContainer>
            <IconButton>
              <label htmlFor="fileSelect">
                <MdPermMedia />
              </label>
            </IconButton>
            <input
              type="file"
              hidden
              id="fileSelect"
              accept="image/*"
              onChange={handleFileSelect}
            />
            <CaptureButtonContainer>
              <CaptureButton onClick={startFocusing}>
                <FaCamera />
              </CaptureButton>
              {isAnimating && (
                <ProgressCircle viewBox="0 0 100 100">
                  <ProgressPath
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    $duration={autoScanInterval}
                  />
                </ProgressCircle>
              )}
            </CaptureButtonContainer>
            <IconButton onClick={() => setShowSettings(true)}>
              <FaCog />
            </IconButton>
          </ControlsContainer>
        </CameraView>
      ) : null}

      <AnimatedPage style={settingsAnimation}>
        {showSettings && (
          <>
            <CloseButton onClick={() => setShowSettings(false)}>
              <FaTimes />
            </CloseButton>
            <h2>Settings</h2>
            <SettingItem>
              <SettingLabel>Auto-scan interval (ms)</SettingLabel>
              <SettingInput
                type="number"
                value={autoScanInterval}
                onChange={(e) =>
                  setAutoScanInterval(parseInt(e.target.value))
                }
              />
            </SettingItem>
          </>
        )}
      </AnimatedPage>

      <AnimatedPage style={historyAnimation}>
        {showHistory && (
          <>
            <CloseButton onClick={() => setShowHistory(false)}>
              <FaArrowLeft />
            </CloseButton>
            <h2>Scan History</h2>
            <SearchBar
              type="search"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {scanHistory.length > 0 ? (
              scanHistory.map((scan: IScannedResult) => (
                <HistoryItem key={scan?.id}>
                  <HistoryImage
                    onClick={() => {
                      setScannedResult(scan);
                      setShowResult(true);
                    }}
                    src={scan?.image}
                    alt={scan?.image || scan?.prediction}
                  />
                  <div>
                    <h4
                      onClick={() => {
                        setScannedResult(scan);
                        setShowResult(true);
                      }}
                    >
                      {scan?.prediction}
                    </h4>
                    <p style={{ fontSize: "10px", color: "grey" }}>
                      {new Date(scan?.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <RemoveButton onClick={() => removeFromHistory(scan?.id)}>
                    <FaTrash size={12} />
                  </RemoveButton>
                </HistoryItem>
              ))
            ) : (
              <p>No history found!</p>
            )}
          </>
        )}
      </AnimatedPage>

      <AnimatedPage style={resultsAnimation}>
        {showResult && (
          <>
            <CloseButton onClick={resetScanner}>
              <FaTimes />
            </CloseButton>

            {(capturedImage !== "" || scannedResult?.image !== "") && (
              <ResultImage
                src={capturedImage || scannedResult?.image}
                alt="Scanned object"
              />
            )}

            {!resultLoading ? (
              <>
                <ResultTitle>{Array.isArray(scannedResult?.prediction)?scannedResult?.prediction[0]:scannedResult?.prediction}</ResultTitle>
                <p
                  style={{
                    fontSize: "11px",
                    color: "grey",
                    fontWeight: "1000",
                  }}
                >
                  Confidence: {Array.isArray(scannedResult?.confidence)?scannedResult?.confidence[0]:scannedResult?.confidence}
                </p>
                <OrganismDetails
                  res={scannedResult?.metaInfo}
                ></OrganismDetails>
                <button
                  disabled={resultSaveLoading}
                  onClick={() => {
                    !capturedImage && scannedResult?.image
                      ? removeFromHistory(scannedResult?.id)
                      : saveToHistory(scannedResult);
                  }}
                  style={{
                    width: "100%",
                    alignSelf: "center",
                    cursor: "pointer",
                    padding: "10px 20px",
                    borderRadius: "12px",
                    background: "#8690fc",
                    color: "#fff",
                  }}
                >
                  {resultSaveLoading ? (
                    <l-mirage size="60" speed="2.5" color="#fff"></l-mirage>
                  ) : !capturedImage && scannedResult?.image ? (
                    "Unsave"
                  ) : (
                    "Save"
                  )}
                </button>
              </>
            ) : (
              <div
                style={{
                  marginTop: "70px",
                  gap: "4px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <l-helix size="90" speed="2.5" color="#ffffff"></l-helix>
                <p style={{ color: "#fff", fontFamily: "monospace" }}>
                  Analysing<span className="dots_loader"></span>
                </p>
              </div>
            )}
          </>
        )}
      </AnimatedPage>

      {showModal && (
        <Modal>
          <ModalContent>
            <CloseButton onClick={() => setShowModal(false)}>
              <FaTimes />
            </CloseButton>
            <h3>How to Scan 🔍</h3>
            <ul
              style={{
                listStyle: "roman",
                padding: "5px 10px",
                fontSize: "14px",
              }}
            >
              <h3>#Option 1</h3>
              <li>Point the camera at an object you want to scan.</li>
              <li>Tap the camera button to capture and analyze the image.</li>
              <li>View the scan results and save them if desired.</li>
              <li>Access your scan history using the search button.</li>
              <li>Adjust settings using the gear icon.</li>
              <h3>#Option 2</h3>
              <p>
                Click on the image icon; left to the camera button to select
                an image from your gallery to scan.
              </p>
            </ul>
          </ModalContent>
        </Modal>
      )}
      <Bot />
    </Container>

    </Div100vh>
    
  );
};

export default Scanner;