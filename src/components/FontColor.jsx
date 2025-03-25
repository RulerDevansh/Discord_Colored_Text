import React, { useEffect, useState } from 'react';
import '@mantine/core/styles.css';
import { Button, ColorPicker, Text } from '@mantine/core';

function FontColor() {
    const [swatchesPerRow, setSwatchesPerRow] = useState(5);

    useEffect(() => {
        const handleResize = () => {
            setSwatchesPerRow(window.innerWidth > 640 ? 5 : 3);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    
    const handleColorChange = (value) => {
        const selection = window.getSelection();
    
        if (!selection.rangeCount) return; // Do nothing if nothing is selected
    
        const range = selection.getRangeAt(0);
        const selectedText = range.toString().trim();
        
        if (!selectedText) return; 
    
        let parentSpan = selection.anchorNode.parentElement;
    
        if (parentSpan && parentSpan.tagName === "SPAN") {
            // Removing any existing `text-[#xxxxxx]` class using regex
            parentSpan.className = parentSpan.className.replace(/text-\[#\w{6}\]/g, "").trim();
    
            parentSpan.classList.add(`text-[${value}]`);
            parentSpan.style.color = value; 
        } else {
            // Wraping the selected text inside a new span
            const span = document.createElement("span");
            span.className = `text-[${value}]`;
            span.textContent = selectedText;
            span.style.color = value;
    
            range.deleteContents();
            range.insertNode(span);
        }

    };
    
    

    const HandleBold = () => {
        const selection = window.getSelection();
    
        if (!selection.rangeCount) return; 
    
        const range = selection.getRangeAt(0);
        const selectedText = range.toString().trim();
        
        if (!selectedText) return;
    
        let parentSpan = selection.anchorNode.parentElement;
    
        if (parentSpan && parentSpan.tagName === "SPAN") {
            parentSpan.classList.add(`font-bold`);
        } else {
            
            const span = document.createElement("span");
            span.className = `font-bold`;
            span.textContent = selectedText;
    
            range.deleteContents();
            range.insertNode(span);
        }
    };

    const Handleline = () => {
        const selection = window.getSelection();
    
        if (!selection.rangeCount) return; 
    
        const range = selection.getRangeAt(0);
        const selectedText = range.toString().trim();
        
        if (!selectedText) return; 
    
        let parentSpan = selection.anchorNode.parentElement;
    
        if (parentSpan && parentSpan.tagName === "SPAN") {
            parentSpan.classList.add(`underline`);
        } else {
            
            const span = document.createElement("span");
            span.className = `underline`;
            span.textContent = selectedText;
    
            range.deleteContents();
            range.insertNode(span);
        }
    
    };

    const HandleReset = () => {
        const selection = window.getSelection();
        const textarea = document.querySelector(".Textarea");
    
        if (!selection.rangeCount || selection.isCollapsed) {
            // if No selection  Reseting entire content
            if (textarea) {
                textarea.innerHTML = textarea.textContent;
            }
            return;
        }
    
        // Reset only the selected part
        const range = selection.getRangeAt(0);
        let parentSpan = selection.anchorNode.parentElement;
    
        if (parentSpan && parentSpan.tagName === "SPAN") {
            parentSpan.className = parentSpan.className
                .replace(/text-\[#\w{6}\]/g, "")  
                .replace(/bg-\[#\w{6}\]/g, "")    
                .trim();

            parentSpan.style.color = "";
            parentSpan.style.backgroundColor = "";
    
            if (parentSpan.className === "") {
                const textNode = document.createTextNode(parentSpan.textContent);
                parentSpan.replaceWith(textNode);
            }
        }
    };
    
    
    
    

    return (
        <div className='bg-cyan-50 h-[100%] pt-4 pr-4 pl-4 '>
            <div className='flex flex-col h-[100%] items-center'>
                <Text size="xl" fs="italic" ta="center" fw={900} variant="gradient" gradient={{ from: 'violet', to: 'red', deg: 90 }}>
                    Font Color
                </Text>
                <div className='w-[85%] h-2/3 flex flex-col justify-evenly items-center'>
                    <ColorPicker
                        onChange={handleColorChange}
                        withPicker={false}
                        fullWidth
                        swatchesPerRow={swatchesPerRow}
                        format="hex"
                        swatches={['#4f545c', '#dc322f', '#859900', '#b58900', '#268bd2', '#d33682', '#2aa198', '#ffffff']}
                    />
                </div>
                <div className='w-[100%] Buttons flex flex-wrap h-1/3 justify-evenly items-center'>
                    <Button onClick={HandleReset} variant="filled" color="gray" size={window.innerWidth > 640 ? 'md' : 'sm'} radius="md"><Text size="md">Reset</Text></Button>
                    <Button onClick={HandleBold} variant="filled" color="gray" size={window.innerWidth > 640 ? 'md' : 'sm'} radius="md"><Text size="md" fw={700}>Bold</Text></Button>
                    <Button onClick={Handleline} variant="filled" color="gray" size={window.innerWidth > 640 ? 'md' : 'sm'} radius="md"><Text td="underline">Line</Text></Button>
                </div>
            </div>
        </div>
    );
}

export default FontColor;
