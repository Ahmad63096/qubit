import React, { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import { greatingMessageurl, url } from '../env';
import { ArrowClick, Handlefile } from './Svg';
import homeicon from '../assets/img/homeicon.png';
import Home from './Home';
import Chat from './Chat';
import Rating from './Rating';
import Animation from './Animation';
import EmojiPicker from 'emoji-picker-react';
import parse from 'html-react-parser';
import { cleanHTML } from './sanitizeHTML';

function Chatbot({ title }) {
    const chatRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isChatOpen, setIsChatOpen] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [showEmojiBox, setShowEmojiBox] = useState(false);
    const [showFileBox, setShowFileBox] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showAnimation, setShowAnimation] = useState(false);
    const [showAnm, setShowAnm] = useState('');
    const [isGreetingDisplayed, setIsGreetingDisplayed] = useState(false);
    const messageQueue = useRef([]);
    const isProcessingQueueRef = useRef(false);
    const animationCompleteRef = useRef(null);
    const inactivityTimer1Ref = useRef(null);
    const inactivityTimer2Ref = useRef(null);
    function generateSessionId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
    function getSessionId() {
        let sessionId = localStorage.getItem('session_id');
        if (!sessionId) {
            sessionId = generateSessionId();
            localStorage.setItem('session_id', sessionId);
            console.log('New session created:', sessionId);
        } else {
            console.log('Existing session:', sessionId);
        }

        return sessionId;
    }
    const visitorTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const visitorCurrentTime = new Date().toLocaleString("en-US", { timeZone: visitorTimeZone });
    async function getVisitorIp() {
        try {
            const response = await fetch("https://api.ipify.org?format=json");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data.ip;

        } catch (error) {
            console.error("Error fetching IP address:", error);
            return null;
        }
    }

    const [visitorIP, setVisitorIP] = useState(null);

    async function openElement() {
        setIsChatOpen(true);
        $(chatRef.current).addClass('expand').find('.chat').addClass('enter');
        setShowAnm('show-anm');
        resetInactivityTimers();
        const ip = await getVisitorIp();
        setVisitorIP(ip);
    }

    function closeElement() {
        $(chatRef.current).removeClass('expand').find('.chat').removeClass('enter');
        setShowAnm('');
        clearInactivityTimers();
    }

    function createUUID() {
        let s = [];
        const hexDigits = '0123456789abcdef';
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = '4';
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = '-';
        return s.join('');
    }
    useEffect(() => {
        // eslint-disable-next-line
        const timer = setTimeout(() => {
            setShowAnimation(true);
        }, 2500);
        const element = $(chatRef.current);
        const myStorage = localStorage;

        if (!myStorage.getItem('chatID')) {
            myStorage.setItem('chatID', createUUID());
        }

        setTimeout(() => {
            element.addClass('enter');
        }, 0);
        element.on('click', openElement);

        const messagesArea = element.find('.messages');
        const handleUserActivity = () => {
            resetInactivityTimers();
        };

        messagesArea.on('click', handleUserActivity);
        messagesArea.on('input', handleUserActivity);
        messagesArea.on('keydown', handleUserActivity);

        return () => {
            messagesArea.off('click', handleUserActivity);
            messagesArea.off('input', handleUserActivity);
            messagesArea.off('keydown', handleUserActivity);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, isChatOpen]);

    useEffect(() => {
        if (messages.length > 0) {
            const messagesContainer = chatRef.current.querySelector('.messages');
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }
        return () => {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundSize = '';
            document.body.style.backgroundRepeat = '';
        }
    }, [messages]);
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    function sendNewMessage() {
        const newMessage = inputValue.trim();
        const ip = visitorIP;
        console.log('new message ip', ip);
        if (!newMessage) return;
        setInputValue('');
        const tempMessage = newMessage;
        setMessages(prevMessages => [
            ...prevMessages,
            { type: 'self', content: tempMessage, time: currentTime }
        ]);
        resetInactivityTimers();
        const payload = {
            session_id: getSessionId(),
            message: newMessage,
            Zone: visitorTimeZone,
            zoneTime: visitorCurrentTime,
            ip: ip
        };
        setLoading(true);
        console.log('message data', payload);
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                setLoading(false);
                console.log('response data', data);
                const replyTime = new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

                const mainResponse = data.main_response || '';
                const questionResponse = data.follow_up_question || '';
                const feedback_form = data.feedback_form;
                let newMessages = [];

                if (mainResponse.trim()) {
                    const sentences = mainResponse.match(/[^.!?]+[.!?]+/g) || [mainResponse]; // 
                    let currentChunk = '';
                    sentences.forEach(sentence => {
                        if ((currentChunk + sentence).length <= 100) {
                            currentChunk += sentence;
                        } else {
                            if (currentChunk.trim()) {
                                newMessages.push({
                                    type: 'other',
                                    content: currentChunk.trim(),
                                    replyTime,
                                });
                            }
                            currentChunk = sentence;
                        }
                    });
                    if (currentChunk.trim()) {
                        newMessages.push({
                            type: 'other',
                            content: currentChunk.trim(),
                            replyTime,
                        });
                    }
                }

                if (questionResponse.trim()) {
                    newMessages.push({
                        type: 'other',
                        content: questionResponse.trim(),
                        replyTime,
                    });
                }

                if (feedback_form === 1) {
                    newMessages.push({
                        type: 'other',
                        content: 'rating',
                        replyTime,
                    });
                }

                if (newMessages.length > 0) {
                    messageQueue.current = [...messageQueue.current, ...newMessages];
                    if (!isProcessingQueueRef.current) {
                        processMessageQueue();
                    }
                }
            })
            // .then(data => {
            //     setLoading(false);
            //     console.log('response data', data);
            //     const replyTime = new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

            //     const mainResponse = data.main_response || '';
            //     const questionResponse = data.follow_up_question || '';
            //     const feedback_form = data.feedback_form;
            //     let newMessages = [];

            //     if (mainResponse.trim()) {
            //         newMessages.push({ type: 'other', content: mainResponse, replyTime });
            //     }

            //     if (questionResponse.trim()) {
            //         newMessages.push({ type: 'other', content: questionResponse, replyTime });
            //     }

            //     if (feedback_form === 1) {
            //         newMessages.push({ type: 'other', content: 'rating', replyTime });
            //     }

            //     if (newMessages.length > 0) {
            //         messageQueue.current = [...messageQueue.current, ...newMessages];
            //         if (!isProcessingQueueRef.current) {
            //             processMessageQueue();
            //         }
            //     }
            // })
            .catch(error => {
                setLoading(false);
                console.error('Error:', error);
            });
        resetInactivityTimers();
    }

    const handleEmojiClick = (emojiObject) => {
        console.log("Emoji Object:", emojiObject);
        if (emojiObject && emojiObject.emoji) {
            setInputValue(prev => prev + emojiObject.emoji);
        } else {
            console.error('Error: Invalid emoji object', emojiObject);
        }
        setShowEmojiBox(false);
        resetInactivityTimers();
    };
    function onEnterPress(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendNewMessage();
        }
    }
    const handleFileClick = () => {
        setShowFileBox(prev => !prev);
        setShowEmojiBox(false);
        resetInactivityTimers();
    };
    const handleEmojiButtonClick = () => {
        setShowEmojiBox(prev => !prev);
        setShowFileBox(false);
        resetInactivityTimers();
    };
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        resetInactivityTimers();
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { type: 'self', text: file.name }
            ]);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('session_id', getSessionId());
            setLoading(true);
            fetch(`${url}/upload`, {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    setLoading(false);
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { type: 'other', text: `File uploaded: ${data.fileName}` }
                    ]);
                })
                .catch(error => {
                    setLoading(false);
                    console.error('File upload error:', error);
                });
        }
        resetInactivityTimers();
    };
    const totalPages = 2;
    let greatingMessage = '';
    fetch(greatingMessageurl)
        .then(response => response.json())
        .then(data => {
            greatingMessage = data.data;
        })
        .catch(error => {
            console.error("Error fetching IP address:", error);
        });
        const handleNext = () => {
            if (currentPage < totalPages) {
                setCurrentPage(prev => prev + 1);
            }
            if (messages.length === 0) {
                setLoading(true);
                setTimeout(() => {
                    setLoading(false);
                    if (messages.length === 0) {
                        const initialMessage = {
                            type: 'other',
                            content: greatingMessage,
                            animated: false,
                            replyTime: currentTime
                        };
                        messageQueue.current = [...messageQueue.current, initialMessage];
                        setIsGreetingDisplayed(true); // Mark greeting as displayed
                        if (!isProcessingQueueRef.current) {
                            processMessageQueue();
                        }
                    }
                }, 1000);
            }
            resetInactivityTimers();
        };
    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
        resetInactivityTimers();
    };
    const processMessageQueue = async () => {
        if (isProcessingQueueRef.current) return;
        isProcessingQueueRef.current = true;

        while (messageQueue.current.length > 0) {
            const nextMessage = messageQueue.current[0];
            messageQueue.current = messageQueue.current.slice(1);

            if (nextMessage.content === 'rating') {
                setMessages(prevMessages => [...prevMessages, nextMessage]);
                continue;
            }
            // Check if message contains HTML
            const containsHTML = typeof nextMessage.content === 'string' && /<\/?[a-z][\s\S]*>/i.test(nextMessage.content);
            let sanitizedContent = nextMessage.content;

            if (containsHTML) {
                sanitizedContent = cleanHTML(nextMessage.content);
            }

            setMessages(prevMessages => [
                ...prevMessages,
                { ...nextMessage, sanitizedContent }
            ]);

            await new Promise(resolve => {
                animationCompleteRef.current = resolve;
            });
            if (nextMessage.content === 'Thank you for visiting! Let us know if you need any further assistance.') {
                localStorage.removeItem('session_id');
                console.log('Session cleared after sending thank you message.');
            }
            if (nextMessage.isFinalMessage) {
                localStorage.removeItem('session_id');
                console.log('Session cleared after sending thank you message.');
            }
        }

        isProcessingQueueRef.current = false;
    };
    useEffect(() => {
        if (!isProcessingQueueRef.current && messageQueue.current.length > 0) {
            processMessageQueue();
        }
    }, [messageQueue.current.length]);
    useEffect(() => {
        localStorage.removeItem('session_id');
        messageQueue.current = [];
    }, []);
    const resetInactivityTimers = () => {
        clearInactivityTimers();
        inactivityTimer1Ref.current = setTimeout(() => {
            enqueueInactivityMessage('waiting');
            inactivityTimer2Ref.current = setTimeout(() => {
                enqueueInactivityMessage('thank you');
            }, 60000); // Additional 60 seconds
        }, 60000); // Initial 60 seconds
    };
    const clearInactivityTimers = () => {
        if (inactivityTimer1Ref.current) {
            clearTimeout(inactivityTimer1Ref.current);
            inactivityTimer1Ref.current = null;
        }
        if (inactivityTimer2Ref.current) {
            clearTimeout(inactivityTimer2Ref.current);
            inactivityTimer2Ref.current = null;
        }
    };

    const enqueueInactivityMessage = (type) => {
        if (!isGreetingDisplayed) return; // Skip if greeting has not been displayed
    
        if (type === 'waiting') {
            const waitingMessage = {
                type: 'other',
                content: 'It looks like you are away. Are you still there?',
                replyTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
                animated: false
            };
            messageQueue.current = [...messageQueue.current, waitingMessage];
        } else if (type === 'thank you') {
            const thankYouMessage = {
                type: 'other',
                content: 'Thank you for visiting! Let us know if you need any further assistance.',
                replyTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
                animated: false,
                isFinalMessage: true
            };
            messageQueue.current = [...messageQueue.current, thankYouMessage];
        }
    
        if (!isProcessingQueueRef.current) {
            processMessageQueue();
        }
    };
    useEffect(() => {
        if (isChatOpen) {
            resetInactivityTimers(); // Start timers if chat is open
        } else {
            clearInactivityTimers(); // Clear timers if chat is closed
        }

        return () => {
            clearInactivityTimers(); // Clean up timers on component unmount
        };
        // eslint-disable-next-line
    }, [isChatOpen]);
    return (
        <>
            <div className={`floating-chat`} ref={chatRef} draggable="false">
                <img id='comments' src={homeicon} alt="" aria-hidden="true" onClick={openElement} style={{ width: '40px', height: 'auto' }} />
                {showAnimation && (
                    <p className={`animation scrolling-text ${showAnm}`}>
                        Got questions? Ask {title}!
                    </p>
                )}
                <div className={`chat`}>
                    {currentPage > 1 && (
                        <>
                            <div className="header">
                                <div className='left-btn-wrap'>
                                    <span className='back-arrow' onClick={handlePrev}>
                                        <i className="fa-solid fa-arrow-left"></i>
                                    </span>
                                    <span className='dropdown' id='dropdown' onClick={toggleDropdown}>
                                        <i className="fa-solid fa-ellipsis"></i>
                                    </span>
                                    {isOpen && (
                                        <div className="dropdown-menu">
                                            <button>
                                                <i className="fa-regular fa-envelope"></i> Send transcript
                                            </button>
                                            <button>
                                                <i className="fa-solid fa-mobile-screen-button"></i> Move chat to mobile
                                            </button>
                                            <button>
                                                <i className="fa-solid fa-volume-high"></i> Sound
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <span className="title">{title}
                                    {/* Assistant */}
                                </span>
                                <button onClick={closeElement}>
                                    <i className="fa fa-times" aria-hidden="true"></i>
                                </button>
                            </div>
                            <ul className="messages">
                                {messages.map((message, index) => {
                                    const isLastMessage = index === messages.length - 1;

                                    return (
                                        <li key={index} className={message.type}>
                                            {message.content === 'rating' ? (
                                                <Rating />
                                            ) : (
                                                <>
                                                    {message.type === 'other' ? (
                                                        <Animation
                                                            animated={message.animated}
                                                            setAnimatedParent={(value) => {
                                                                setMessages((prevMessages) => {
                                                                    const newMessages = [...prevMessages];
                                                                    newMessages[index].animated = value;
                                                                    return newMessages;
                                                                });
                                                            }}
                                                            onAnimationCompleteParent={() => {
                                                                if (isLastMessage && animationCompleteRef.current) {
                                                                    animationCompleteRef.current();
                                                                    animationCompleteRef.current = null;
                                                                }
                                                            }}
                                                            message={
                                                                typeof message.sanitizedContent === 'string'
                                                                    ? parse(message.sanitizedContent)
                                                                    : message.sanitizedContent
                                                            }
                                                        />
                                                    ) : (
                                                        message.content
                                                    )}
                                                    <div className="timestamp">
                                                        {message.type === 'self' ? message.time : message.replyTime}
                                                    </div>
                                                </>
                                            )}
                                        </li>
                                    );
                                })}
                                {loading && (
                                    <li className="other">
                                        <div className="loading">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </li>
                                )}
                            </ul>
                            <div className='btn_wrap'>
                                <div className="scroll-container"></div>
                            </div>
                            <div className="footer">
                                <textarea type="text"
                                    rows={1}
                                    className="text-box"
                                    value={inputValue}
                                    onChange={(e) => { setInputValue(e.target.value); resetInactivityTimers(); }}
                                    onKeyDown={onEnterPress}
                                    placeholder="Enter here...."></textarea>
                                <button id="fileadd" onClick={handleFileClick}>
                                    <Handlefile />
                                </button>
                                {showFileBox && (
                                    <div className="file-box">
                                        <button onClick={() => document.getElementById('fileInput').click()} >
                                            <i className="fa-solid fa-file-circle-plus"></i> Send a file
                                        </button>
                                        <button onClick={() => document.getElementById('fileInput').click()} >
                                            <i className="fa-solid fa-images"></i> Attach a screenshot
                                        </button>
                                        <input
                                            type="file"
                                            id="fileInput"
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleFileChange(e)}
                                            accept="image/*"
                                        />
                                    </div>
                                )}
                                <button id="emojibutton" onClick={handleEmojiButtonClick}>
                                    <i className="fa-regular fa-face-smile"></i>
                                </button>
                                {showEmojiBox && (
                                    <div className="emoji-box">
                                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                                    </div>
                                )}
                                <button id="sendMessage" onClick={sendNewMessage} disabled={!inputValue.trim()}>
                                    <ArrowClick />
                                </button>
                            </div>
                            <Chat />
                        </>
                    )}
                    {currentPage < totalPages && (
                        <>
                            <Home handleNext={handleNext} closeElement={closeElement} title={title} />
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default Chatbot;