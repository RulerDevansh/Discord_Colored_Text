import React, { useRef, useState } from 'react';
import { Text ,Button ,Notification} from '@mantine/core';
import {ansiColorsF,ansiColorsB} from './color'

function TextArea() {
  const TextAreaRef = useRef(null);
  const [noti, setNoti] = useState(null);
  const content =`<span style="color: #dc322f;">Write</span> Your <span style="color: #d33682;">Discord</span> Text <span style="color: #b58900;">Here !!</span>`;
  const [copyText, setCopyText] = useState('Copy');
  const handleCopy = () => {
    if (!TextAreaRef.current) return;

    let ModifiedValue = "";
    // Function to convert spans into ANSI escape codes
    const convertToAnsi = (element) => {
        let ansiString = "";
        element.childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                ansiString += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                let startCode = "";
                let endCode = "\u001b[0m"; // Reset ANSI code
                
                // Extract text color
                const textColorMatch = node.className.match(/text-\[#([0-9a-fA-F]{6})\]/);
                if (textColorMatch) {
                    const colorCode = `#${textColorMatch[1]}`;
                    if (ansiColorsF[colorCode]) {
                        startCode += `\u001b[${ansiColorsF[colorCode]}m`;
                    }
                }

                // Extract background color
                const bgColorMatch = node.className.match(/bg-\[#([0-9a-fA-F]{6})\]/);
                if (bgColorMatch) {
                    const bgColorCode = `#${bgColorMatch[1]}`;
                    if (ansiColorsB[bgColorCode]) {
                        startCode += `\u001b[${ansiColorsB[bgColorCode]}m`;
                    }
                }

                // Extract bold
                if (node.classList.contains("bold")) {
                    startCode += "\u001b[1m";
                }

                // Extract underline
                if (node.classList.contains("underline")) {
                    startCode += "\u001b[4m";
                }

                ansiString += startCode + node.textContent + endCode;
            }
        });

        return ansiString;
    };

    ModifiedValue = convertToAnsi(TextAreaRef.current);

    // Wrap in Discord's ANSI code block
    const discordAnsiCode = `\`\`\`ansi\n${ModifiedValue}\n\`\`\``;

    navigator.clipboard.writeText(discordAnsiCode).then(() => {
      setNoti(<Notification onClose={()=>{setNoti(null)}} radius="xl" title="Copied !!"></Notification>)
    }).catch((err) => {
      console.error("Failed to copy: ", err);
      setNoti(<Notification onClose={()=>{setNoti(null)}} radius="xl" title="Failed to copy !!"></Notification>)
});

    setCopyText('Copied!!');
    setTimeout(() => {
        setCopyText('Copy');
    }, 1000);

    console.log(discordAnsiCode);
};

  return (
    <div className="bg-fuchsia-200 h-[100%] pt-4 pr-4 pl-4">
      <div className='absolute top-5 left-1/2 transform -translate-x-1/2'>
        {noti}
      </div>
      <Text
        size="xl"
        fs="italic"
        ta="center"
        fw={900}
        variant="gradient"
        gradient={{ from: 'violet', to: 'red', deg: 90 }}
      >
        Discord Text
      </Text>
      <br />
      <div
        className="Textarea w-full h-40 p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        contentEditable
        ref={TextAreaRef}
        dangerouslySetInnerHTML={{ __html: content }}
      >
      </div>
      <br />
      <Button onClick={handleCopy} variant="light" color="teal" size="md" radius="md">
        <Text size="md" fw={700}>{copyText}</Text>
      </Button>
    </div>
  );
}

export default TextArea;
