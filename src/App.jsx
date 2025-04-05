import { useState, useEffect } from "react";
import { Player } from "@remotion/player";
import { MyVideoComposition } from "./components/MyVideoComposition";

const fps = 30; // Frames per second

const App = () => {
  const [videos, setVideos] = useState([]); // Array to hold all uploaded videos
  const [audioUrl, setAudioUrl] = useState(null); // State to store the audio URL
  const [isAudioPlaying, setIsAudioPlaying] = useState(false); // State to manage audio playback
  const [previewIndex, setPreviewIndex] = useState(null); // Index to track which video is in preview mode

  // Handle video upload
  const handleUpload = (e) => {
    const files = e.target.files;
    const newVideos = [];

    for (let i = 0; i < files.length; i++) {
      const url = URL.createObjectURL(files[i]);
      newVideos.push({
        url,
        duration: 0,
        startTime: { hours: 0, minutes: 1, seconds: 30 }, // Default start time (1:30)
        endTime: { hours: 0, minutes: 2, seconds: 50 }, // Default end time (2:50)
        preview: false,
      });
    }
    setVideos((prevVideos) => [...prevVideos, ...newVideos]);
  };

  // Extract Audio from Video File
  const extractAudio = (videoUrl) => {
    // Create a new audio element to extract audio
    const audioElement = new Audio(videoUrl);
    audioElement.crossOrigin = "anonymous"; // Allow cross-origin loading

    // Set up an event listener to extract audio when the video is ready to play
    audioElement.oncanplay = () => {
      // Set the audio URL for playback
      setAudioUrl(videoUrl);
    };
  };

  // Toggle audio playback
  const toggleAudioPlayback = () => {
    const audioElement = new Audio(audioUrl); // Create a new audio element with the audio URL

    if (isAudioPlaying) {
      audioElement.pause(); // Pause the audio
    } else {
      audioElement.play(); // Play the audio
    }

    setIsAudioPlaying(!isAudioPlaying);
  };

  const updateDuration = (index, duration) => {
    setVideos((prevVideos) =>
      prevVideos.map((video, i) =>
        i === index ? { ...video, duration } : video
      )
    );
  };

  const timeToSeconds = (time) => {
    return time.hours * 3600 + time.minutes * 60 + time.seconds;
  };

  const handlePreviewToggle = (index) => {
    setPreviewIndex(previewIndex === index ? null : index);
  };

  return (
    <div style={{ padding: 20 }}>
      <input type="file" accept="video/*" onChange={handleUpload} multiple />

      {videos.map((video, index) => {
        const startInSeconds = timeToSeconds(video.startTime);
        const endInSeconds = timeToSeconds(video.endTime);

        return (
          <div key={index} style={{ marginTop: "20px" }}>
            <div>
              <video
                src={video.url}
                preload="metadata"
                style={{ display: "none" }}
                onLoadedMetadata={(e) =>
                  updateDuration(index, e.target.duration)
                }
              />
              <div style={{ margin: "10px 0" }}>
                <h3>Video {index + 1}</h3>
                <label>
                  Start Time:
                  <input
                    type="number"
                    value={video.startTime.hours}
                    min={0}
                    max={23}
                    onChange={(e) =>
                      setVideos((prevVideos) =>
                        prevVideos.map((v, i) =>
                          i === index
                            ? {
                                ...v,
                                startTime: {
                                  ...v.startTime,
                                  hours: Number(e.target.value),
                                },
                              }
                            : v
                        )
                      )
                    }
                  />
                  :
                  <input
                    type="number"
                    value={video.startTime.minutes}
                    min={0}
                    max={59}
                    onChange={(e) =>
                      setVideos((prevVideos) =>
                        prevVideos.map((v, i) =>
                          i === index
                            ? {
                                ...v,
                                startTime: {
                                  ...v.startTime,
                                  minutes: Number(e.target.value),
                                },
                              }
                            : v
                        )
                      )
                    }
                  />
                  :
                  <input
                    type="number"
                    value={video.startTime.seconds}
                    min={0}
                    max={59}
                    onChange={(e) =>
                      setVideos((prevVideos) =>
                        prevVideos.map((v, i) =>
                          i === index
                            ? {
                                ...v,
                                startTime: {
                                  ...v.startTime,
                                  seconds: Number(e.target.value),
                                },
                              }
                            : v
                        )
                      )
                    }
                  />
                </label>
                <label style={{ marginLeft: 20 }}>
                  End Time:
                  <input
                    type="number"
                    value={video.endTime.hours}
                    min={0}
                    max={23}
                    onChange={(e) =>
                      setVideos((prevVideos) =>
                        prevVideos.map((v, i) =>
                          i === index
                            ? {
                                ...v,
                                endTime: {
                                  ...v.endTime,
                                  hours: Number(e.target.value),
                                },
                              }
                            : v
                        )
                      )
                    }
                  />
                  :
                  <input
                    type="number"
                    value={video.endTime.minutes}
                    min={0}
                    max={59}
                    onChange={(e) =>
                      setVideos((prevVideos) =>
                        prevVideos.map((v, i) =>
                          i === index
                            ? {
                                ...v,
                                endTime: {
                                  ...v.endTime,
                                  minutes: Number(e.target.value),
                                },
                              }
                            : v
                        )
                      )
                    }
                  />
                  :
                  <input
                    type="number"
                    value={video.endTime.seconds}
                    min={0}
                    max={59}
                    onChange={(e) =>
                      setVideos((prevVideos) =>
                        prevVideos.map((v, i) =>
                          i === index
                            ? {
                                ...v,
                                endTime: {
                                  ...v.endTime,
                                  seconds: Number(e.target.value),
                                },
                              }
                            : v
                        )
                      )
                    }
                  />
                </label>
              </div>

              {/* Preview Button */}
              <button onClick={() => handlePreviewToggle(index)}>
                {previewIndex === index
                  ? "Show Original Video"
                  : "Preview Trimmed Video"}
              </button>

              {/* Extract Audio Button */}
              <button onClick={() => extractAudio(video.url)}>
                Extract Audio
              </button>

              {/* Play or Pause Audio Button */}
              {audioUrl && (
                <button onClick={toggleAudioPlayback}>
                  {isAudioPlaying ? "Pause Audio" : "Play Audio"}
                </button>
              )}

              {/* Show the correct video based on the preview state */}
              {previewIndex === index ? (
                <Player
                  component={MyVideoComposition}
                  inputProps={{
                    videoUrl: video.url,
                    startFrom: Math.floor(startInSeconds * fps), // Convert to frames
                    endAt: Math.floor(endInSeconds * fps), // Convert to frames
                  }}
                  durationInFrames={Math.floor(
                    (endInSeconds - startInSeconds) * fps
                  )} // Video duration in frames
                  fps={fps}
                  compositionWidth={1280}
                  compositionHeight={720}
                  acknowledgeRemotionLicense
                  controls
                  autoPlay
                />
              ) : (
                <video
                  src={video.url}
                  controls
                  style={{
                    width: "100%",
                    height: "auto",
                    marginTop: "20px",
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default App;
