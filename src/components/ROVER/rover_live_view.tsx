/* eslint-disable react/require-default-props */
import ReactPlayer from 'react-player';

interface EVALiveViewProps {
    url: string;
    volume?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function RoverLiveView({ url, volume = 0.5 }: EVALiveViewProps) {
    const playerStyle = {
        borderBottomLeftRadius: '12px',
        borderBottomRightRadius: '12px',
        borderTopRightRadius: '12px',
        borderTopLeftRadius: '12px',
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

export default RoverLiveView;
