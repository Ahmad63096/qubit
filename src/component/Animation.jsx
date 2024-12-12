import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

function Animation({ message, animated, setAnimatedParent, onAnimationCompleteParent }) {
    const [displayContent, setDisplayContent] = useState(
        typeof message === 'string' ? '' : message
    );
    const animationRef = useRef(null);
    const setAnimated = useRef(setAnimatedParent);
    const onAnimationComplete = useRef(onAnimationCompleteParent);

    useEffect(() => {
        if (typeof message === 'string') {
            if (!animated) {
                let index = 0;
                const interval = 30; 

                animationRef.current = setInterval(() => {
                    setDisplayContent(message.slice(0, index + 1));
                    index++;
                    if (index === message.length) {
                        clearInterval(animationRef.current);
                        setAnimated.current(true);
                        if (onAnimationComplete.current) {
                            onAnimationComplete.current();
                        }
                    }
                }, interval);

                return () => clearInterval(animationRef.current);
            } else {
                setDisplayContent(message);
            }
        } else {
            setDisplayContent(message);
        }
    }, [message, animated]);

    return <>{displayContent}</>;
}

Animation.propTypes = {
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    animated: PropTypes.bool.isRequired,
    setAnimatedParent: PropTypes.func.isRequired,
    onAnimationCompleteParent: PropTypes.func,
};

export default React.memo(Animation);
