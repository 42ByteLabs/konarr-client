declare module "@jamescoyle/vue-icon" {
  import { DefineComponent } from "vue";

  interface SvgIconProps {
    type: string;
    path: string;
    size?: string | number;
    viewbox?: string;
    flip?: string;
    rotate?: number;
    spin?: boolean | number;
    color?: string;
  }

  const SvgIcon: DefineComponent<SvgIconProps>;
  export default SvgIcon;
}
