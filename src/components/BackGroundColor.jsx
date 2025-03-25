import { ColorPicker, Text } from '@mantine/core'
import { useEffect, useState } from 'react'


function BackGroundColor() {
    
    const [swatchesPerRow, setSwatchesPerRow] =useState(5);
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
        if (!selection.rangeCount) return;
    
        const range = selection.getRangeAt(0);
        const selectedText = range.toString().trim();
        if (!selectedText) return;
    
        let parentSpan = selection.anchorNode.parentElement;
    
        if (parentSpan && parentSpan.tagName === "SPAN") {
            parentSpan.className = parentSpan.className.replace(/bg-\[#\w{6}\]/g, "").trim();
            parentSpan.classList.add(`bg-[${value}]`);
            parentSpan.style.backgroundColor = value;
        } else {
            
            const span = document.createElement("span");
            span.className = `bg-[${value}]`;
            span.style.backgroundColor = value;
            span.textContent = selectedText;
    
            range.deleteContents();
            range.insertNode(span);
        }
    };
    

  return (
    <div className="bg-amber-100 h-[100%] pt-4 pr-4 pl-4 "
    >
        <Text
        size="xl"
        fs="italic"
        ta="center"
        fw={900}
        variant="gradient"
        gradient={{ from: 'violet', to: 'red', deg: 90  }}
        >
        Highlight Color
        </Text>
        <div className='h-2/3 flex flex-col justify-evenly items-center'>
            <ColorPicker onChange={handleColorChange} withPicker={false } fullWidth swatchesPerRow={swatchesPerRow} format="hex" swatches={['#002b36', '#cb4b16', '#586e75', '#657b83', '#839496', '#6c71c4', '#93a1a1', '#fdf6e3']}/>
        </div>

    </div>
  )
}

export default BackGroundColor