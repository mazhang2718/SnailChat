# Read more about app structure at http://docs.appgyver.com

module.exports =

  # See styling options for tabs and other native components in app/common/native-styles/ios.css or app/common/native-styles/android.css
  tabs: [
    {
      title: "Feed"
      id: "Feed"
      location: "Feed#index" # Supersonic module#view type navigation
    }
  ]

  # rootView:
  #   location: "Feed#index"

  preloads: [
    {
      id: "messages"
      location: "Feed#messages"
    }
  ]

  # drawers:
  #   left:
  #     id: "leftDrawer"
  #     location: "example#drawer"
  #     showOnAppLoad: false
  #   options:
  #     animation: "swingingDoor"
  #
  # initialView:
  #   id: "initialView"
  #   location: "example#initial-view"
