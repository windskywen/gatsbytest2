import * as React from "react"
const axios = require('axios')

// markup
const IndexPage = () => {
  const handleChange = (e) => {
    console.log(e)
  }

  const getMyCouncil = () => {
    console.log("clicked")
    navigator.geolocation.getCurrentPosition((e) => {
      findCouncilLocation(e)
    })
  }

  const findCouncilLocation = (position) => {
    console.log(position)
    var lat = position.coords.latitude
    var lng = position.coords.longitude
    searchRegion(lat, lng)
  }

  const searchRegion = async (lat, lng) => {
    //https://www.mycommunitydiary.com.au/SearchRegion?lat=-27.5738417&lng=153.0838714&address=
    var url = `https://www.mycommunitydiary.com.au/SearchRegion?lat=${lat}&lng=${lng}&address=`
    console.log("url: ", url)
    const res = await axios.post(url)
    console.log('res: ', res)

    console.log(res.data)
    window.location.href = 'https://www.mycommunitydiary.com.au/' + res.data

  }

  return (
    <main>
      Where are you?
      <div className="wrapper">
        <div>
          <input id="search-bar" type="text" placeholder="Location" name="location" onChange={handleChange} />

        </div>
        <div>
          <button onClick={getMyCouncil}>Go</button>
        </div>
      </div>
    </main>
  )
}

export default IndexPage
