export function BackgroundVideo() {
    return (
      <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
        <video
          autoPlay
          loop
          muted
          className="absolute w-full h-full object-cover"
          poster="https://ampd-asset.s3.us-east-2.amazonaws.com/troops-poster.png"
        >
          <source src="https://ampd-asset.s3.us-east-2.amazonaws.com/Salute-To-Troops.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-[#2A304C] opacity-50"></div>
      </div>
    )
  }
  
  