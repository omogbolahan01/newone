import { useState, useRef } from "react";
import { Player } from "@remotion/player";
import { MyVideoComposition } from "./components/MyVideoComposition";

const fps = 30;

const App = () => {
  const [videos, setVideos] = useState([]);
  const mainVideoRefs = useRef([]);
  const previewRefs = useRef([]);

  const timeToSeconds = (time) =>
    time.hours * 3600 + time.minutes * 60 + time.seconds;

  const handleUpload = (e) => {
    const files = e.target.files;
    const newVideos = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      duration: 0,
      startTime: { hours: 0, minutes: 1, seconds: 30 },
      endTime: { hours: 0, minutes: 2, seconds: 50 },
      showTrimmed: false,
    }));

    setVideos((prev) => [...prev, ...newVideos]);
  };

  const handlePreviewToggle = (index) => {
    setVideos((prev) =>
      prev.map((v, i) =>
        i === index ? { ...v, showTrimmed: !v.showTrimmed } : v
      )
    );
  };

  const handlePreviewClick = (e, index) => {
    const videoElement = previewRefs.current[index];
    const rect = e.target.getBoundingClientRect();
    const clickPos = e.clientX - rect.left;
    const percentage = clickPos / rect.width;
    const video = videos[index];

    const start = timeToSeconds(video.startTime);
    const end = timeToSeconds(video.endTime);
    const duration = end - start;

    const clickedTime = start + percentage * duration;
    videoElement.currentTime = clickedTime;

    const mainVideo = mainVideoRefs.current[index];
    if (mainVideo) mainVideo.currentTime = clickedTime;
  };

  const updateTime = (index, field, subField, value) => {
    setVideos((prev) =>
      prev.map((v, i) =>
        i === index
          ? {
              ...v,
              [field]: { ...v[field], [subField]: Number(value) },
            }
          : v
      )
    );
  };

  const updateDuration = (index, duration) => {
    setVideos((prev) =>
      prev.map((v, i) => (i === index ? { ...v, duration } : v))
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <input type="file" accept="video/*" multiple onChange={handleUpload} />

      {videos.map((video, index) => {
        const startSec = timeToSeconds(video.startTime);
        const endSec = timeToSeconds(video.endTime);
        const isTrimmed = video.showTrimmed;

        return (
          <div key={index} style={{ marginTop: 30 }}>
            <h3>Video {index + 1}</h3>

            <video
              src={video.url}
              preload="metadata"
              style={{ display: "none" }}
              onLoadedMetadata={(e) => updateDuration(index, e.target.duration)}
            />

            {/* Time Inputs */}
            <div style={{ display: "flex", gap: 20, marginBottom: 10 }}>
              <div>
                <label>Start Time: </label>
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={video.startTime.hours}
                  onChange={(e) =>
                    updateTime(index, "startTime", "hours", e.target.value)
                  }
                />
                :
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={video.startTime.minutes}
                  onChange={(e) =>
                    updateTime(index, "startTime", "minutes", e.target.value)
                  }
                />
                :
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={video.startTime.seconds}
                  onChange={(e) =>
                    updateTime(index, "startTime", "seconds", e.target.value)
                  }
                />
              </div>

              <div>
                <label>End Time: </label>
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={video.endTime.hours}
                  onChange={(e) =>
                    updateTime(index, "endTime", "hours", e.target.value)
                  }
                />
                :
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={video.endTime.minutes}
                  onChange={(e) =>
                    updateTime(index, "endTime", "minutes", e.target.value)
                  }
                />
                :
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={video.endTime.seconds}
                  onChange={(e) =>
                    updateTime(index, "endTime", "seconds", e.target.value)
                  }
                />
              </div>
            </div>

            <button onClick={() => handlePreviewToggle(index)}>
              {isTrimmed ? "Show Original Video" : "Preview Trimmed Video"}
            </button>

            <div style={{ marginTop: 15 }}>
              {isTrimmed ? (
                <div style={{ width: "100%", aspectRatio: "16 / 9" }}>
                  <Player
                    component={MyVideoComposition}
                    inputProps={{
                      videoUrl: video.url,
                      startFrom: Math.floor(startSec * fps),
                      endAt: Math.floor(endSec * fps),
                    }}
                    durationInFrames={Math.floor((endSec - startSec) * fps)}
                    fps={fps}
                    compositionWidth={1280}
                    compositionHeight={720}
                    controls
                    autoPlay
                    style={{
                      width: "100%",
                      height: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              ) : (
                <video
                  ref={(el) => (mainVideoRefs.current[index] = el)}
                  src={video.url}
                  controls
                  style={{ width: "100%", height: "auto", marginTop: 10 }}
                />
              )}
            </div>

            {/* Clickable Trimmed Preview */}
            <div
              onClick={(e) => handlePreviewClick(e, index)}
              style={{
                marginTop: 10,
                width: "100%",
                height: "100px",
                cursor: "pointer",
                overflow: "hidden",
                borderRadius: 6,
              }}
            >
              <video
                ref={(el) => (previewRefs.current[index] = el)}
                src={video.url}
                muted
                autoPlay
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onLoadedMetadata={(e) => {
                  e.target.currentTime = startSec;
                }}
                onTimeUpdate={(e) => {
                  if (isTrimmed) {
                    const current = e.target.currentTime;
                    if (current >= endSec) {
                      e.target.currentTime = startSec;
                    }
                  }
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default App;
