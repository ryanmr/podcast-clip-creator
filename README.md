# Podcast Clip Creator

This helps create a short video clip by pulling the album art, title and series metadata from an MP3 podcast file.

This is like Marco's [podcast clip sharing feature in Overcast](https://marco.org/2019/04/27/overcast-clip-sharing). I don't have an iOS device but I do record podcasts, and wanted to share clips in a similar style.

## Tech

- Canvas
- [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext)
- [React 16.8](https://reactjs.org/blog/2019/02/06/react-v16.8.0.html) / [React Router](https://reacttraining.com/react-router/)
- [Styled Components](https://www.styled-components.com/) / [Rebass](https://rebassjs.org/)
- [music-metadata-browser](https://www.npmjs.com/package/music-metadata-browser)

As an experiment, some of the _library_ components of this codebase were written with TypeScript.

## How does it work?

1. Select an MP3 podcast file
2. App extracts album art, title and series metadata
3. Set start time and duration of recording
4. Records duration from start time
5. Outputs a `.webm` video

At the end of all of this, you get a `.webm` file which is good, but not _great_ since it does not have compatibility with iOS devices. The app will give you a nice `ffmpeg` command to run on the downloaded copy of the `.webm` file to convert it to a more cross platform `.mp4` version.

## Future?

Future goals may include:

* timeline vs input form time selection
* `.mp4` generation inline in browser

For my own uses, the next version of this kind of tool is:

* a CLI version; possibly in Rust
* that may _not_ be JavaScript based
* that could draw frames programmatically
* that could interop with `ffmpeg` directly for increased flexibility and encoding performance