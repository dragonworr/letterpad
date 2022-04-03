import { EventAction, track } from "@/track";
import { Menu } from "antd";
import { socket } from "@/components/post/components/tinymce/socket";

const QuickMenu = ({ siteUrl, postHash, showDrawer }) => {
  return (
    <Menu>
      <Menu.Item key="0" onClick={showDrawer} data-testid="postSettingsLink">
        Settings
      </Menu.Item>
      <Menu.Divider />
      {siteUrl && (
        <Menu.Item
          key="2"
          onClick={() => {
            track({
              eventAction: EventAction.Change,
              eventCategory: "setting",
              eventLabel: "preview",
            });
            window.open(siteUrl + "/preview/" + postHash);
          }}
        >
          Preview
        </Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item
        key="3"
        onClick={() => {
          track({
            eventAction: EventAction.Click,
            eventCategory: "post",
            eventLabel: "grammar",
          });
          socket.checkGrammar();
        }}
      >
        Check Grammar
      </Menu.Item>
    </Menu>
  );
};
export default QuickMenu;
