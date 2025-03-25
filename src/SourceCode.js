const textarea = document.querySelector("#textarea");
    const copybtn = document.querySelector(".button.copy");
    const tooltip = document.querySelector(".tooltip");

    const tooltipTexts = {
        // FG
        "30": "Dark Gray (33%)",
        "31": "Red",
        "32": "Yellowish Green",
        "33": "Gold",
        "34": "Light Blue",
        "35": "Pink",
        "36": "Teal",
        "37": "White",
        // BG
        "40": "Blueish Black",
        "41": "Rust Brown",
        "42": "Gray (40%)",
        "43": "Gray (45%)",
        "44": "Light Gray (55%)",
        "45": "Blurple",
        "46": "Light Gray (60%)",
        "47": "Cream White",
    };

    // Some basic escaping of pasted HTML tags, not ideal but good enough for this situation.
    textarea.oninput = () => {
        const base = textarea.innerHTML.replace(/<(\/?(br|span|span class="ansi-[0-9]*"))>/g,"[$1]");
        if (base.includes("<") || base.includes(">")) textarea.innerHTML = base.replace(/<.*?>/g,"").replace(/[<>]/g,"").replace(/\[(\/?(br|span|span class="ansi-[0-9]*"))\]/g,"<$1>");
    };

    // https://stackoverflow.com/a/61237402
    document.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            document.execCommand('insertLineBreak')
            event.preventDefault()
        }
    });

    document.querySelectorAll(".style-button").forEach((btn) => {
        btn.onclick = () => {
            if (!btn.dataset.ansi) {
                textarea.innerText = textarea.innerText;
                return;
            }

            const selection = window.getSelection();
            const text = window.getSelection().toString();
            
            const span = document.createElement("span");
            span.innerText = text;
            span.classList.add(`ansi-${btn.dataset.ansi}`);

            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(span);

            range.selectNodeContents(span);
            selection.removeAllRanges();
            selection.addRange(range);
        };
        btn.onmouseenter = () => {
            if (!(btn.dataset.ansi > 4)) return;
            const rect = btn.getBoundingClientRect();
            tooltip.style.display = "block";
            tooltip.innerText = tooltipTexts[btn.dataset.ansi];
            tooltip.style.top = `${rect.top - 36}px`;
            tooltip.style.left = `${rect.left - tooltip.clientWidth/2 + btn.clientWidth/2}px`;
        };
        btn.onmouseleave = () => {
            tooltip.style.display = "none";
        };
    });

    function nodesToANSI(nodes, states) {
        let text = ""
        for (const node of nodes) {
            if (node.nodeType === 3) {
                text += node.textContent;
                continue;
            }
            if (node.nodeName === "BR") {
                text += "\n";
                continue;   
            }
            const ansiCode = +(node.className.split("-")[1]);
            const newState = Object.assign({}, states.at(-1));

            if (ansiCode < 30) newState.st = ansiCode;
            if (ansiCode >= 30 && ansiCode < 40) newState.fg = ansiCode;
            if (ansiCode >= 40) newState.bg = ansiCode;

            states.push(newState)
            text += `\x1b[${newState.st};${(ansiCode >= 40) ? newState.bg : newState.fg}m`;
            text += nodesToANSI(node.childNodes, states);
            states.pop()
            text += `\x1b[0m`;
            if (states.at(-1).fg !== 2) text += `\x1b[${states.at(-1).st};${states.at(-1).fg}m`;
            if (states.at(-1).bg !== 2) text += `\x1b[${states.at(-1).st};${states.at(-1).bg}m`;
        }
        return text;
    }

    let copyCount = 0;
    let copyTimeout = null;

    copybtn.onclick = () => {
        const toCopy = "```ansi\n" + nodesToANSI(textarea.childNodes, [{ fg: 2, bg: 2, st:2 }]) + "\n```";
        navigator.clipboard.writeText(toCopy).then(() => {
            if (copyTimeout) clearTimeout(copyTimeout);

            const funnyCopyMessages = copybtn.innerText = ["Copied!", "Double Copy!", "Triple Copy!", "Dominating!!", "Rampage!!", "Mega Copy!!", "Unstoppable!!", "Wicked Sick!!", "Monster Copy!!!", "GODLIKE!!!", "BEYOND GODLIKE!!!!", Array(16).fill(0).reduce(p => p + String.fromCharCode(Math.floor(Math.random() * 65535)),"")];

            copybtn.style.backgroundColor = (copyCount <= 8) ? "#3BA55D" : "#ED4245";
            copybtn.innerText = funnyCopyMessages[copyCount];
            copyCount = Math.min(11, copyCount + 1);
            copyTimeout = setTimeout(() => {
                copyCount = 0;
                copybtn.style.backgroundColor = null;
                copybtn.innerText = "Copy text as Discord formatted";
            }, 2000)

        }, (err) => {
            // We don't need to stop the users if they get a little too excited about the button
            if (copyCount > 2) return;
            alert("Copying failed for some reason, let's try showing an alert, maybe you can copy it instead.");
            alert(toCopy);
        });
    };