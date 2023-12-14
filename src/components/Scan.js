import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { UisMultiply } from "@iconscout/react-unicons-solid";

const Scan = ({ onClose }) => {
  const [uid, setUid] = useState("");
  const [redeemedStatus, setRedeemedStatus] = useState("");
  const [warning, setWarning] = useState("");
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    let qrCodeScanner;

    const onScanSuccess = (qrCodeMessage) => {
      try {
        const { uid, redeemedStatus } = JSON.parse(qrCodeMessage);
        setUid(uid);
        setRedeemedStatus(redeemedStatus);
        setWarning("");
        setShowSuccessPopup(true);
      } catch (error) {
        setWarning("Invalid QR Code");
      }
    };

    if (isScannerActive) {
      qrCodeScanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 15, qrbox: 200 },
        false
      );
      qrCodeScanner.render(onScanSuccess);
    }

    return () => {
      if (qrCodeScanner) {
        qrCodeScanner.clear();
      }
    };
  }, [isScannerActive]);

  const toggleScanner = () => {
    setIsScannerActive(!isScannerActive);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <div className="scan">
      <div className="scan__header">
        <div className="scan__header__title">Scan QR Code</div>
        <div className="scan__header__close" onClick={onClose}>
          <UisMultiply size="25" />
        </div>
      </div>
      <div className="scan__content">
        <div className="scan__content__warning">{warning}</div>
        <div className="scan__content__qr-reader" id="qr-reader"></div>
        <div className="scan__content__uid">{uid}</div>
        <div className="scan__content__redeemed-status">{redeemedStatus}</div>
        <div className="scan__content__toggle-scanner" onClick={toggleScanner}>
          {isScannerActive ? "Stop" : "Start"} Scanner
        </div>
      </div>
      {showSuccessPopup && (
        <div className="scan__success-popup">
          <div className="scan__success-popup__content">
            <div className="scan__success-popup__content__title">Success!</div>
            <div className="scan__success-popup__content__uid">UID: {uid}</div>
            <div className="scan__success-popup__content__redeemed-status">
              Status: {redeemedStatus}
            </div>
            <div
              className="scan__success-popup__content__close"
              onClick={closeSuccessPopup}
            >
              <UisMultiply size="25" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scan;
