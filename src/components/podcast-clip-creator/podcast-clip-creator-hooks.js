import { useState, useRef, useEffect } from "react";
import {
  clearCanvas,
  drawBackground,
  drawTitles,
  drawImage,
  drawProgressBar,
  drawCurrentTime,
  drawRemainingTime
} from "../../library/drawing";
import { convertPodcastTimeToSeconds } from "../../library/timing";

export function useCanvasContext() {
  const canvasRef = useRef();
  const contextRef = useRef();

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    contextRef.current = canvasRef.current.getContext("2d");
  }, [contextRef, canvasRef]);

  return {
    canvasRef,
    contextRef
  };
}

export function useMediaUrlState() {
  const [imageUrl, setImageUrl] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  return [
    { imageUrl, setImageUrl },
    { audioUrl, setAudioUrl },
    { videoUrl, setVideoUrl }
  ];
}

export function useFormState() {
  const [startTime, setStartTime] = useState("00:00:00");
  const [duration, setDuration] = useState(20);
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [episodeSeries, setEpisodeSeries] = useState("");

  return [
    { startTime, setStartTime },
    { duration, setDuration },
    { episodeTitle, setEpisodeTitle },
    { episodeSeries, setEpisodeSeries }
  ];
}

export function useUpdatePreview({
  imageRef,
  imageUrl,
  contextRef,
  canvasRef,
  episodeTitle,
  episodeSeries
}) {
  useEffect(() => {
    if (imageUrl) {
      clearCanvas(contextRef.current);
      drawBackground(canvasRef.current, contextRef.current);
      drawTitles(contextRef.current, episodeTitle, episodeSeries);
      drawImage(contextRef.current, imageRef.current);
      drawProgressBar(contextRef.current);
      drawCurrentTime(contextRef.current, "42:29");
      drawRemainingTime(contextRef.current, "00:28");
    }
  }, [imageRef, imageUrl, episodeTitle, episodeSeries, canvasRef, contextRef]);
}

export function useUpdateAudioStartTime({ audioRef, startTime }) {
  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    audioRef.current.currentTime = convertPodcastTimeToSeconds(startTime);
  }, [startTime, audioRef]);
}

export function useUpdateAudioContextFromAudioUrl({
  audioUrl,
  audioRef,
  audioContext,
  audioSource,
  audioDestination
}) {
  useEffect(() => {
    if (!audioUrl || !audioRef.current) {
      return;
    }
    audioContext.current = new AudioContext();
    audioSource.current = audioContext.current.createMediaElementSource(
      audioRef.current
    );

    audioDestination.current = audioContext.current.createMediaStreamDestination();
    audioSource.current.connect(audioDestination.current);
  }, [audioUrl, audioRef, audioContext, audioSource, audioDestination]);
}
