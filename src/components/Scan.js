import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { UisMultiply } from "@iconscout/react-unicons-solid";
import axios from "axios";

const Scan = ({ onClose }) => {
  const [uid, setUid] = useState("");
  const [redeemedStatus, setRedeemedStatus] = useState("");
  const [redeem, setRedeem] = useState(true);
  const [warning, setWarning] = useState("");
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [ticketNotFound, setTicketNotFound] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const onScanSuccess = async (qrCodeMessage) => {
    setWarning("");
    const decode = atob(qrCodeMessage);
    setUid(decode);

    try {
      const res = await axios.get(`http://localhost:8080/api/uid/${decode}`);
      console.log(res.data.valid);

      if (!res.data.valid) {
        setRedeem(false);
        setRedeemedStatus("Sudah di-redeem");
        setSuccessMessage("Tiket sudah di-redeem sebelumnya.");
      } else {
        setRedeem(true);
        setRedeemedStatus("Belum di-redeem");
        setSuccessMessage("Silahkan di-redeem");
      }

      setShowSuccessPopup(true);
      setTicketNotFound(false);
    } catch (err) {
      console.log(`Error from server: ${err}`);
      setRedeemedStatus("Not Redeemed");
      setShowSuccessPopup(true);
      setTicketNotFound(true);
    }
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

    return () => qrCodeScanner?.clear();
  }, [isScannerActive]);

  const toggleScanner = () => {
    setIsScannerActive((prevIsScannerActive) => !prevIsScannerActive);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    setTicketNotFound(false);
  };

  const redeemHandler = async () => {
    try {
      if (redeem) {
        const res = await axios.post(`http://localhost:8080/api/redeem`, { id: uid });

        if (res.data) {
          setRedeem(false);
          setSuccessMessage("Berhasil di redeem");
          setRedeemedStatus(
            res.data.redeemed ? "Silahkan di redeem" : "Sudah di redeem"
          );
          setShowSuccessPopup(true);
        } else {
          setSuccessMessage("Gagal di redeem. Tiket sudah di-redeem sebelumnya.");
        }
      } else {
        setSuccessMessage("Tiket sudah di-redeem sebelumnya.");
      }
    } catch (err) {
      console.log(err);
      setWarning("Gagal di redeem. Silahkan coba lagi.");
    }
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
          <div className="scan__success-popup">
            <div className="scan__success-popup__content">
              {ticketNotFound ? (
                <div className="scan__success-popup__content__title">
                  Ticket tidak ditemukan
                </div>
              ) : (
                <>
                  <div className="scan__success-popup__content__title">
                    {successMessage || showSuccessPopup}
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
                </>
              )}
              <div
                className="scan__success-popup__content__close"
                onClick={closeSuccessPopup}
              >
                <UisMultiply size="25" />
              </div>
            </div>
          </div>
        )}

        <div className="scan__content__toggle-scanner" onClick={toggleScanner}>
          {isScannerActive ? "Stop" : "Start"} Scanner
        </div>
      </div>
    </div>
  );
};

export default Scan;
