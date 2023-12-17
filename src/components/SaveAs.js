import React from "react";
import Box from '@mui/material/Box';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import { Typography } from "@mui/material";
import { PDFDownloadLink } from '@react-pdf/renderer';
import MyDocument from './PdfDoc'



const generateImg = (text) => {
  // const canvas = document.createElement('canvas');
  // const ctx = canvas.getContext('2d');
  // ctx.font = '30px Arial';
  // ctx.fillText('Hello, world!', 10, 50);
  // const dataUrl = canvas.toDataURL();

  var canvas = document.getElementById("canvas");
  const ctx = canvas.getContext('2d');
  ctx.font = '30px Arial';
  ctx.fillText(text, 10000, 50000);
  var url = canvas.toDataURL("image/png");
  var link = document.createElement('a');
  link.download = 'solveIt.png';
  link.href = url;
  link.click();
}


function SaveAs({text, sx}) {

  return (
    <Box
      width='100%'
    //   spacing={14}
      sx={{display: 'flex', ...sx}}
    >
        {
          //<Typography ml={1} mr={2}>Save As: </Typography>
          //<canvas id="canvas" style={{position: "absolute",}} width="100vh" height="100vh"></canvas>
          //<ImageIcon onClick={() => generateImg(text)}/>
        }
          <PDFDownloadLink document={<MyDocument data={text}/>} fileName="solveIt.pdf">
            {({ blob, url, loading, error }) =>
              !loading && <PictureAsPdfIcon/>
            }
          </PDFDownloadLink>
          
    </Box>
  );
}

export default SaveAs;
