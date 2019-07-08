import React, { useState, useRef } from "react";

import { convertSecondsToPodcastTime } from "../../library/timing";
import {
  getMetadataFromMediaFile,
  getAlbumArtData,
  getAlbumArtImage,
  getFileInfo,
  getSafeFilename
} from "../../library/media";
import {
  clearCanvas,
  drawBackground,
  drawTitles,
  drawImage,
  drawProgressBar,
  drawCurrentTime,
  drawRemainingTime
} from "../../library/drawing";

import { Flex, Box, Heading, Text, Button } from "rebass";

import { Hidden } from "../elements/Hidden";
import { SpecialHeading } from "../elements/Headings";
import { TextInput, Label, InputWrapper, FileInput } from "../elements/Input";
import {
  useCanvasContext,
  useFormState,
  useMediaUrlState,
  useUpdatePreview,
  useUpdateAudioStartTime,
  useUpdateAudioContextFromAudioUrl
} from "./podcast-clip-creator-hooks";

export function PodcastClipCreator() {
  const { canvasRef, contextRef } = useCanvasContext();

  const imageRef = useRef();
  const audioRef = useRef();
  const audioContext = useRef();
  const audioSource = useRef();
  const audioDestination = useRef();
  const mediaRecorderRef = useRef();
  const chunks = useRef([]);
  const videoRef = useRef();
  const animationRef = useRef();
  const initialTime = useRef(0);

  const [recording, setRecording] = useState(false);

  const [
    { imageUrl, setImageUrl },
    { audioUrl, setAudioUrl },
    { videoUrl, setVideoUrl }
  ] = useMediaUrlState();

  const [fileInfo, setFileInfo] = useState({});

  const [
    { startTime, setStartTime },
    { duration, setDuration },
    { episodeTitle, setEpisodeTitle },
    { episodeSeries, setEpisodeSeries }
  ] = useFormState();

  useUpdatePreview({
    imageRef,
    imageUrl,
    canvasRef,
    contextRef,
    episodeSeries,
    episodeTitle
  });

  useUpdateAudioStartTime({
    audioRef,
    startTime
  });

  useUpdateAudioContextFromAudioUrl({
    audioContext,
    audioDestination,
    audioRef,
    audioSource,
    audioUrl
  });

  function handleExportVideo() {
    setRecording(false);
    if (chunks.current.length) {
      const blob = new Blob(chunks.current);
      const objectVideoUrl = URL.createObjectURL(blob);
      setVideoUrl(objectVideoUrl);
    }
  }

  async function fileOnChange(event) {
    try {
      const file = event.currentTarget.files[0];

      const metadata = await getMetadataFromMediaFile(file);
      const picture = getAlbumArtData(metadata);
      const image = await getAlbumArtImage(picture);

      const fileBlob = new Blob([file]);
      const fileUrl = URL.createObjectURL(fileBlob);

      imageRef.current = image;

      setFileInfo(getFileInfo(file));
      setImageUrl(image.src);
      setAudioUrl(fileUrl);
      setEpisodeTitle(metadata.common.title);
      setEpisodeSeries(metadata.common.album);
    } catch (e) {
      console.log("error");
      console.error(e);
    }
  }

  function animate() {
    const currentPlaybackTime = convertSecondsToPodcastTime(
      audioRef.current.currentTime
    );

    const start = initialTime.current;
    const now = Date.now();
    const timeRemaining = duration - (now - start) / 1000;
    const timeRemainingClamp = timeRemaining < 0 ? 0 : timeRemaining;
    const recordingRatio = (now - start) / 1000 / duration;
    const recordingRatioClamp = Math.max(Math.min(1, recordingRatio), 0);

    clearCanvas(contextRef.current);

    drawBackground(canvasRef.current, contextRef.current);

    drawTitles(contextRef.current, episodeTitle, episodeSeries);
    drawImage(contextRef.current, imageRef.current);
    drawProgressBar(contextRef.current, recordingRatioClamp);

    drawCurrentTime(contextRef.current, currentPlaybackTime);
    drawRemainingTime(
      contextRef.current,
      `− ${convertSecondsToPodcastTime(timeRemainingClamp)}`
    );

    animationRef.current = window.requestAnimationFrame(animate);

    /**
     * Stop recording audio first,
     * then continue recording video for at least
     * 1 extra second so the video ends less abruptly.
     */
    if (timeRemaining <= -1) {
      cancelAnimationFrame(animationRef.current);
      audioRef.current.pause();
      mediaRecorderRef.current.stop();
    } else if (timeRemaining <= 0) {
      audioRef.current.pause();
    }
  }

  function handleRecording(e) {
    e.preventDefault();

    setRecording(true);

    const cStream = canvasRef.current.captureStream();
    cStream.addTrack(audioDestination.current.stream.getAudioTracks()[0]);

    const recorder = new MediaRecorder(cStream);

    recorder.ondataavailable = e => {
      e.data.size && chunks.current.push(e.data);
    };

    recorder.onstop = handleExportVideo;

    mediaRecorderRef.current = recorder;

    initialTime.current = Date.now();
    recorder.start();
    audioRef.current.play();
    animationRef.current = window.requestAnimationFrame(animate);
  }

  const safeFilename = getSafeFilename(episodeTitle);

  function handleDownload() {
    // Create an invisible A element
    const a = document.createElement("a");
    a.style.display = "none";
    document.body.appendChild(a);

    // Set the HREF to a Blob representation of the data to be downloaded
    a.href = videoUrl;

    // Use download attribute to set set desired file name
    a.setAttribute("download", `${safeFilename}.webm`);

    // Trigger the download by simulating click
    a.click();

    // Cleanup
    document.body.removeChild(a);
  }

  const fieldsEditable = fileInfo && fileInfo.name;
  const canRecord = fileInfo && fileInfo.name && audioRef.current && !recording;

  return (
    <div>
      <Box px={4} mt={3} mb={5}>
        <Heading>Podcast Clip Creator</Heading>
        <Text>simple audiograms for the rest of us</Text>
      </Box>

      <Box px={4}>
        <form>
          <InputWrapper>
            <Label htmlFor="media-file">Media File</Label>
            <div style={{ flex: 2 }}>
              <FileInput id="media-file" type="file" onChange={fileOnChange} />
              <label htmlFor="media-file">
                {fileInfo.name ? fileInfo.name : "Choose a file"}
              </label>
            </div>
          </InputWrapper>
        </form>
      </Box>

      <Box px={4}>
        <form>
          <InputWrapper>
            <Label htmlFor="episode-title">Episode Title</Label>
            <TextInput
              type="text"
              id="episode-title"
              placeholder="Never Gonna Give You Up"
              value={episodeTitle}
              onChange={e => setEpisodeTitle(e.target.value)}
              disabled={!fieldsEditable}
            />
          </InputWrapper>

          <InputWrapper>
            <Label htmlFor="episode-series">Episode Series</Label>
            <TextInput
              type="text"
              id="episode-series"
              placeholder="At The Nexus"
              value={episodeSeries}
              onChange={e => setEpisodeSeries(e.target.value)}
              disabled={!fieldsEditable}
            />
          </InputWrapper>

          <InputWrapper>
            <Label htmlFor="start-time">Start Time</Label>
            <TextInput
              type="text"
              id="start-time"
              placeholder="13:37"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              disabled={!fieldsEditable}
            />
          </InputWrapper>

          <InputWrapper>
            <Label htmlFor="duration">Duration</Label>
            <TextInput
              type="text"
              id="duration"
              placeholder="30"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              disabled={!fieldsEditable}
            />
          </InputWrapper>

          {canRecord && (
            <Box my={2}>
              <Button type="button" onClick={handleRecording}>
                Record
              </Button>
            </Box>
          )}

          {recording && (
            <Box my={2}>
              <Text fontSize={2} fontWeight={"bold"}>
                Recording In Progress
              </Text>
              <Text>
                You will <strong>not</strong> hear any audio during the
                recording process, but you will in the final output.
              </Text>
            </Box>
          )}
        </form>
      </Box>

      <Hidden>
        {audioUrl && <audio src={audioUrl} ref={audioRef} controls />}
      </Hidden>

      <Box mt={2} px={4}>
        <Flex justifyContent="center">
          <Box width={[1, 1 / 2]} p={2}>
            <SpecialHeading>Preview</SpecialHeading>
            <canvas
              ref={canvasRef}
              width="600"
              height="600"
              style={{ maxWidth: "100%" }}
            />
          </Box>

          <Box width={[1, 1 / 2]} p={2}>
            <SpecialHeading>Output</SpecialHeading>
            {videoUrl && (
              <video
                src={videoUrl}
                ref={videoRef}
                controls
                style={{ maxWidth: "100%" }}
              />
            )}
          </Box>
        </Flex>

        {videoUrl && (
          <>
            <Flex>
              <Box width={1} p={2}>
                <Button onClick={handleDownload}>Download Clip</Button>
              </Box>
            </Flex>
            <Flex justifyContent="center">
              <Box width={1} p={2}>
                <Text>
                  Podcast Clips are produced in{" "}
                  <a href="https://en.wikipedia.org/wiki/WebM">
                    <code>webm</code>
                  </a>{" "}
                  format. You may consider converting the file into a more
                  suitable cross-platform <code>mp4</code>.
                  <br />
                  If you have{" "}
                  <a href="https://trac.ffmpeg.org/wiki/CompilationGuide/macOS#ffmpegthroughHomebrew">
                    ffmpeg
                  </a>{" "}
                  on your machine, here is a command you can use to bootstrap
                  that conversion.
                </Text>
                <pre style={{ overflowY: "auto" }}>
                  <code>
                    ffmpeg -i "{`${safeFilename}.webm`}" -movflags faststart "
                    {`${safeFilename}.mp4`}"
                  </code>
                </pre>
              </Box>
            </Flex>
          </>
        )}
      </Box>
    </div>
  );
}
