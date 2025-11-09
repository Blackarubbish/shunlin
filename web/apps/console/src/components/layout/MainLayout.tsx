import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGlobalMenu } from "@/providers/useGlobalMenu";
import { AppGuard } from "../Guard";
import { MainHeader } from "./MainHeader";
import { MainSideBar } from "./MainSideBar";

const { Content } = Layout;
export const MainLayout: React.FC = () => {
  const { menuItems, currentKey, handleItemClick, collapsed, setCollapsed } =
    useGlobalMenu();
  const { logout, user } = useAuth();

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "个人资料",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "设置",
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
      danger: true,
      onClick: () => {
        logout();
      },
    },
  ];

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      console.log("用户退出登录");
      // 这里添加退出登录逻辑
    } else {
      console.log("用户菜单点击:", key);
    }
  };

  return (
    <AppGuard>
      <Layout className="min-h-screen">
        {/* 侧边栏 */}
        <MainSideBar
          collapsed={collapsed}
          title="博客管理"
          menuItems={menuItems}
          currentKey={currentKey}
          handleItemClick={handleItemClick}
        />

        <Layout>
          <MainHeader
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            userMenuItems={userMenuItems}
            handleUserMenuClick={handleUserMenuClick}
            user={user}
          />
          {/* 主内容区 */}
          <Content className="p-6 overflow-y-auto h-[calc(100vh-74px)] overflow-auto">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </AppGuard>
  );
};
