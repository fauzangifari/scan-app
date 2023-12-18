import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { UisMultiply } from "@iconscout/react-unicons-solid";
import axios from "axios";

const Scan = ({ onClose }) => {
  const [uid, setUid] = useState("");
  const [redeemedStatus, setRedeemedStatus] = useState("");
  const [redeem, setRedeem] = useState(false);
  const [warning, setWarning] = useState("");
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const onScanSuccess = (qrCodeMessage) => {
    setWarning("");
    const decode = atob(qrCodeMessage);
    setUid(decode);

    axios
      .get(`http://localhost:5000/api/uid/${decode}`)
      .then((res) => {
        setRedeem(res.data.redeemed ? true : false);
        setShowSuccessPopup(true);
      })
      .catch((err) => {
        setRedeemedStatus("Not Redeemed");
        setShowSuccessPopup(true);
      });
  };

  useEffect(() => {
    let qrCodeScanner;

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
    setIsScannerActive((prevIsScannerActive) => !prevIsScannerActive);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  const redeemHandler = () => {
    axios
      .post(`http://localhost:5000/api/redeem`, { uid: uid })
      .then((res) => {
        if (res.data.redeemed) {
          setRedeem(true);
          setRedeemedStatus("Silahkan di redeem");
        } else {
          setRedeem(false);
          setRedeemedStatus("Sudah di redeem");
        }
        setShowSuccessPopup(true);
      })
      .catch((err) => {
        console.log(err);
      });
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
        {showSuccessPopup && (
          <>
            <div className="scan__content__uid">{uid}</div>
            <div className="scan__content__redeemed-status">
              {redeemedStatus}
            </div>
          </>
        )}
        <div className="scan__content__toggle-scanner" onClick={toggleScanner}>
          {isScannerActive ? "Stop" : "Start"} Scanner
        </div>
      </div>
      {showSuccessPopup && (
        <div className="scan__success-popup">
          {redeem
            ? true(
                <div className="scan__success-popup__content__title">
                  {redeemedStatus}
                </div>
              )
            : false(
                <div className="scan__success-popup__content">
                  <div className="scan__success-popup__content__title">
                    {showSuccessPopup}
                  </div>
                  <div className="scan__success-popup__content__uid">
                    UID: {uid}
                  </div>
                  <div className="scan__success-popup__content__redeemed-status">
                    Status: {redeemedStatus}
                  </div>
                  <button
                    className="scan__success-popup__content__button"
                    onClick={redeemHandler}
                  >
                    Redeem
                  </button>
                  <div
                    className="scan__success-popup__content__close"
                    onClick={closeSuccessPopup}
                  >
                    <UisMultiply size="25" />
                  </div>
                </div>
              )}
        </div>
      )}
    </div>
  );
};

export default Scan;
