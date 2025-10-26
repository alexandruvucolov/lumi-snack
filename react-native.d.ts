declare module "react-native" {
  export * from "react-native/types";

  import { ComponentType } from "react";

  export const View: ComponentType<any>;
  export const Text: ComponentType<any>;
  export const ScrollView: ComponentType<any>;
  export const Image: ComponentType<any>;
  export const StyleSheet: any;
  export const Dimensions: any;
  export const Pressable: ComponentType<any>;
  export const TouchableOpacity: ComponentType<any>;
  export const Animated: any;
  export const Linking: any;
}
