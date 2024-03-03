import { ComponentAttributes } from "../types";
import { PlacementProperties } from "./PlacementProperties";

export interface PropertiesTabProps extends ComponentAttributes {}

export const PropertiesTab = (props: PropertiesTabProps) => {

  return (
  <div>
    <PlacementProperties {...props} />
  </div>
  )
}