export function BackgroundVideo() {
    return (
      <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
        <video
          autoPlay
          loop
          muted
          className="absolute w-full h-full object-cover"
          poster="https://storage.googleapis.com/groovy-ego-462522-v2.firebasestorage.app/recap%20poster.png"
        >
          <source src="https://storage.googleapis.com/groovy-ego-462522-v2.firebasestorage.app/Salute-To-Troops.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-[#2A304C] opacity-50"></div>
      </div>
    )
  }
  
  