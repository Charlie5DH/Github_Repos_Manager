import { Bell, GitMergeIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

type NavbarProps = {
  unreadCount: number;
  notifications: Array<{ id: string; message: string; timestamp: Date }>;
  handleNotificationClick: () => void;
};

const Navbar: React.FC<NavbarProps> = ({
  unreadCount,
  notifications,
  handleNotificationClick,
}: NavbarProps) => {
  return (
    <div className="flex flex-row gap-3 items-center justify-center px-2 w-full dark:bg-black h-14 border-b border-dashed">
      <div className="flex items-center gap-2 border-x-[1px] border-dashed w-full max-w-[1440px] h-full">
        <div className="flex items-center w-full justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <h1 className="text-2xl font-bold">GH Explorer</h1>
              <GitMergeIcon size={24} />
            </div>
            <nav className="flex space-x-4">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Search
              </Link>
              <Link
                to="/my-repos"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                My Repos
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span
                      className="absolute top-[-1] right-0 inline-flex items-center justify-center px-2 py-1 text-xs 
                    font-bold leading-none text-primary-foreground bg-primary rounded-full transform translate-x-1/2 -translate-y-1/2"
                    >
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-80"
                onClick={handleNotificationClick}
              >
                {notifications.length === 0 ? (
                  <DropdownMenuItem>No notifications</DropdownMenuItem>
                ) : (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex flex-col items-start"
                    >
                      <span className="font-medium">
                        {notification.message}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {notification.timestamp.toLocaleString()}
                      </span>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
