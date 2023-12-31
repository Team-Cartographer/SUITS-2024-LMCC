/* eslint-disable react/require-default-props */
import ReactPlayer from 'react-player';

interface EVALiveViewProps {
    evaNumber: number;
    url: string;
    volume?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function EVALiveView({ evaNumber, url, volume = 0.5 }: EVALiveViewProps) {
    const playerStyle = {
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px',
        overflow: 'hidden',
    };

    return (
        <div>
            <ReactPlayer
                url={url}
                playing
                volume={volume}
                style={playerStyle}
            />
        </div>
    );
}

export default EVALiveView;
