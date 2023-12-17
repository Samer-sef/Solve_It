import './Home.css';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, { useState } from "react";
import SaveAs from "../components/SaveAs";
import Tesseract from 'tesseract.js';
import OpenAI from "openai";
import { FileUploader } from "react-drag-drop-files";
import Zoom from '@mui/material/Zoom';
import { TypeAnimation } from 'react-type-animation';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';


const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API,
});


function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

function Home() {

    const [uploadedFile, setUploadedFile] = useState();
    const [textFromChatGpt, setTextFromChatGpt] = useState();
    const [calledChatGpt, setCalledChatGpt] = useState(false);
    const [tesseractLoadingPercentage, setTesseractLoadingPercentage] = useState(0);

    const solveQuestions = async (text) => {
      const content = 'Answer all these questions with organized format: ' + text
      setCalledChatGpt(true)
      const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              "role": "system",
              "content": "You will be provided with one or more questions.\nIf user does not provide a question tell him to upload a new picture."
            },
            { role: 'user', content: content }
          ],
          max_tokens: 1024,
          temperature: 0.79,
          top_p: 1,
          frequency_penalty: 0.66,
          presence_penalty: 0,
        });
      setTextFromChatGpt(response.choices[0].message.content)
    }


    const resetPageStates = () => {
      setCalledChatGpt(false)
      setTextFromChatGpt("")
      setUploadedFile(null)
    }

    const displayThumbnail = (file) => {
      const reader = new FileReader();
      let x = reader.readAsDataURL(file)
      reader.onloadend = function(e) {
        setUploadedFile(reader.result)
      }
      setUploadedFile(x)
    }

    const extractTextFromPic = (file) => {
      let imagePath = URL.createObjectURL(file)
      Tesseract.recognize(
          imagePath,'eng',
          { 
          logger: m => setTesseractLoadingPercentage(parseInt(m.progress) * 100) 
          }
      )
      .catch (err => {
          console.error(err);
      })
      .then(result => {
          let confidence = result.confidence
          let text = result.data.text
          solveQuestions(text);
      })
    }

    const handleClick = (file) => {
      resetPageStates()
      displayThumbnail(file)
      extractTextFromPic(file)
    }

  return (
    <Grid
      container
      flexDirection={calledChatGpt ? "row" : "column"}
    >
      <Grid item xs={calledChatGpt ? 6 : 12}>
        <Grid
          container
          bgcolor="#B3E5FC"
          justifyContent="center" 
          height="100vh"
        >
          <Grid item xs={12} height="30vh">
            <Box
              bgcolor="#B3E5FC"
              p={7}
            >
              <Typography variant="h6" gutterBottom>SolveIt</Typography>
              <Typography variant="h6" gutterBottom>Get answers for any question you have!</Typography>
            </Box>
          </Grid>
          <Grid
            container
            xs={11.6}
            mb={3}
            alignSelf="self-end"
            bgcolor="#fff"
            height="65vh"
            justifyContent="center"
            alignItems="center"
          >
            <FileUploader
              handleChange={handleClick}
              name="file"
              types={["JPG", "PNG"]}
              required
              hoverTitle="Drop here!"
              children={
                <Typography sx={{
                      borderWidth: 1,
                      borderStyle: "dashed",
                      padding: 5,
                      cursor: "move",
                      cursor: "grab",
                      cursor: "-moz-grab",
                      cursor: "-webkit-grab",
                    }}
                >
                  {!uploadedFile ? 
                    <Grid
                      container
                      width={460}
                      height={240}
                      justifyContent="center"
                      alignContent="center"
                    >
                      <AttachFileIcon/>
                      Drag & Drop, Upload or Paste image
                    </Grid>
                    :
                  <Box>
                    <img
                      width={400}
                      height={240}
                      src={uploadedFile}
                      />
                      <LinearProgressWithLabel value={tesseractLoadingPercentage} />
                  </Box>
                  
                  }
                </Typography>
              }
              onTypeError={(err) => console.log(err)}
            />
          </Grid>
        </Grid>
      </Grid>
      <Zoom in={calledChatGpt} style={{ transitionDelay: true ? '500ms' : '0ms' }}>
        <Grid
          item
          xs={calledChatGpt? 6 : 0}
          bgcolor="#FAFAFA"
          sx={{display: calledChatGpt? "inline" : "none", position: "relative"}}
        >
            <CloseIcon
              style={{position: "absolute", right: "30"}}
              onClick={() => resetPageStates()}
              text={textFromChatGpt}
            />
            <Grid
              container
              sx={{
                height: "100vh",
              }}>
              {textFromChatGpt ?
                <TypeAnimation
                  sequence={[
                    textFromChatGpt,
                    1000,
                  ]}
                  speed={70}
                  style={{
                    whiteSpace: 'pre-line',
                    fontSize: '1.3em',
                    overflow: "hidden",
                    overflowY: "scroll",
                    height: 700,
                    wordWrap: "break-word",
                    textAlign: "left",
                    marginBottom: 3,
                    paddingRight: 3,
                    paddingLeft: 3,
                  }}
                  repeat={Infinity}
                />
                : 
                <CircularProgress sx={{m: 4}}/>
              }
            </Grid>
            {textFromChatGpt && <SaveAs sx={{position: "absolute", bottom: "2vh"}} text={textFromChatGpt}/>}
        </Grid>
      </Zoom>
    </Grid>
  );
}

export default Home;
