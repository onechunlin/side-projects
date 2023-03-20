import { useState, FC, useEffect, useRef } from "react";
import { Button, Select, Divider } from "antd";
import "./index.less";

const filterList = [
  "blur(5px)",
  "brightness(0.3)",
  "contrast(180%)",
  "grayscale(1)",
  "hue-rotate(180deg)",
  "invert(100%)",
  "opacity(50%)",
  "saturate(7)",
  "sepia(100%)",
  "drop-shadow(8px 8px 10px green)",
];

const LocalView: FC = () => {
  const [imgList, setImgList] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>();

  const videoRef = useRef<HTMLVideoElement>(null);

  async function getLocalStream(constraints: MediaStreamConstraints) {
    // 获取本地媒体流
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    // 播放本地媒体流
    playLocalStream(stream);
  }

  function playLocalStream(stream: MediaStream) {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.srcObject = stream;
  }

  function getImageUrl(filter?: string): string {
    const videoEl = videoRef.current;
    const canvasEl = document.createElement("canvas");

    if (!videoEl) {
      return "";
    }

    canvasEl.width = videoEl.videoWidth;
    canvasEl.height = videoEl.videoHeight;

    const ctx = canvasEl.getContext("2d");
    if (!ctx) {
      return "";
    }

    if (filter) {
      ctx.filter = filter;
    }
    ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
    const imgUrl = canvasEl.toDataURL("image/png");

    return imgUrl;
  }

  function takePhoto() {
    const img = getImageUrl(filter);
    setImgList((imgList) => imgList.concat([img]));
  }

  useEffect(() => {
    getLocalStream({ video: true, audio: false });
  }, []);

  return (
    <div className="local-view">
      <div className="action-container">
        <video ref={videoRef} autoPlay></video>
        <Select
          style={{ width: 240 }}
          placeholder="选择滤镜"
          onChange={setFilter}
          options={filterList.map((filter) => ({
            label: filter,
            value: filter,
          }))}
        />
        <Button type="primary" onClick={() => takePhoto()}>
          拍照
        </Button>
      </div>
      <Divider />
      <div className="img-container">
        {imgList.map((url, index) => (
          <img key={index} src={url} width={300} height={200} />
        ))}
      </div>
    </div>
  );
};

export default LocalView;
