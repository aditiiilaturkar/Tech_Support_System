import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const DisplayAna = () => {
    const ticketData = [
        { x: new Date(2023, 11, 26), y: 10 },
        { x: new Date(2023, 11, 27), y: 15 },
        { x: new Date(2023, 11, 28), y: 20 },
        { x: new Date(2023, 11, 29), y: 18 },
        { x: new Date(2023, 11, 30), y: 12 },
        { x: new Date(2023, 11, 31), y: 8 },
        { x: new Date(2024, 0, 1), y: 5 }
    ];

    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2",
        title: {
            text: "Number of Tickets Created - Last Week"
        },
        axisY: {
            title: "Number of Tickets"
        },
        axisX: {
            title: "Date",
            valueFormatString: "DD MMM"
        },
        data: [{
            type: "column",
            toolTipContent: "{x}: {y}",
            dataPoints: ticketData
        }]
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', 
        padding: '20px' 
    };

    const chartStyle = {
        maxWidth: '90%', 
        width: '100%' 
    };

    return (
        <div style={containerStyle}>
            <div style={chartStyle}>
                <CanvasJSChart options={options} />
            </div>
        </div>
    );
};

export default DisplayAna;
