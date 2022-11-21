import { extendTheme } from "@chakra-ui/react"
import '@fontsource/raleway/400.css'
import '@fontsource/open-sans/700.css'
import { Button } from "./button"
// 2. Call `extendTheme` and pass your custom values
export const theme = extendTheme({
  colors: {
    brand: {
      100: "#FF3c00",
    },
  },
  fonts: {
    heading: `'Open Sans', sans-serif`,
    body: `'Raleway', sans-serif`,
  },
  styles: {
     global: () => ({
        body:{
            bg: "gray.200"
        }
     })
  },
  components:{
     Button,
  }
})

