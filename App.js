import React from "react"
import { Linking, Button, StyleSheet, Text, View, Image, ActivityIndicator } from "react-native"
// import Auth from "@aws-amplify/auth"
// import Analytics from "@aws-amplify/analytics"
import ImagePicker from "react-native-image-picker"

import awsconfig from "./aws-exports.js"
// import AWS from "aws-sdk"
import Amplify, { Storage } from "aws-amplify"
import { S3Image, withAuthenticator } from "aws-amplify-react-native"
import aws_exports from "./aws-exports"
import RNFetchBlob from "react-native-fetch-blob"
import { Buffer } from "buffer"
Amplify.configure(aws_exports)

// retrieve temporary AWS credentials and sign requests
// Auth.configure(awsconfig)
// send analytics events to Amazon Pinpoint
// Analytics.configure(awsconfig)

class App extends React.Component {
  constructor(props) {
    super(props)
    // this.handleAnalyticsClick = this.handleAnalyticsClick.bind(this)
    this.state = {
      imageUrl: "",
      fileUrl: "",
      file: "",
      filename: "",
      fetching: false
    }
  }

  getImage = file => {
    this.setState({ fetching: true })
    Storage.get("IMG_0005.JPG", {
      level: "private"
    })
      .then(result => {
        console.log("RESULT", result)
        this.setState({ imageUrl: result, fetching: false })
      })
      .catch(err => console.log(err))
  }

  openImagePicker = () => {
    ImagePicker.launchImageLibrary({ mediaType: "mixed" }, response => {
      console.log("RESPONSE", response)
      const readFile = filePath => {
        return RNFetchBlob.fs.readFile(filePath, "base64").then(data => new Buffer(data, "base64"))
      }

      readFile(response.origURL)
        .then(buffer => {
          Storage.put(response.fileName, buffer, {
            level: "private"
          }).then(result => console.log("S3 RESULT", result))
        })
        .catch(e => {
          console.log(e)
        })
    })
  }

  render() {
    const { imageUrl, fetching } = this.state
    return (
      <View style={styles.container}>
        <ActivityIndicator animating={fetching} size="large" />
        <Text>Welcome to your React Native App with Amplify!</Text>
        <Button title="Open Picker" onPress={this.openImagePicker} />
        <Button title="Get Image from S3" onPress={this.getImage} />
        <Image
          source={{ uri: imageUrl }}
          style={{ width: 200, height: 200, borderWidth: 1, borderColor: "black" }}
          defaultSource={require("./person.png")}
        />
      </View>
    )
  }
}

export default withAuthenticator(App, true)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  link: {
    color: "blue"
  }
})
