import React from 'react'
import { withPrefix } from "gatsby"


export const onRenderBody = (
    { setHeadComponents, setPostBodyComponents },
    pluginOptions
) => {
    setHeadComponents([
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA5lpuK-uttumzvDE0GCy4nG28L-Qgknho&libraries=places" async></script>
        , <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    ])

}
//setPostBodyComponents([
//    <script src={withPrefix('initScript.js')} type="text/javascript" />,
//])