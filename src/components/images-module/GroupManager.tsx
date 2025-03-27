import { useState } from "react";
import { useStore } from "@/store/appStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

export default function GroupManager() {
  const [groupName, setGroupName] = useState("");
  const [parentId, setParentId] = useState<string | undefined>();
  const { groups, addGroup, removeGroup } = useStore();

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    addGroup(groupName.trim(), parentId);
    setGroupName("");
    setParentId(undefined);
  };

  const getGroupHierarchy = (groupId: string): string => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return "";

    if (group.parentId) {
      const parentHierarchy = getGroupHierarchy(group.parentId);
      return parentHierarchy
        ? `${parentHierarchy} > ${group.name}`
        : group.name;
    }

    return group.name;
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full transform -translate-x-1/2 translate-y-1/2" />

      <CardHeader>
        <CardTitle className="text-2xl font-bold">Manage Groups</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleAddGroup} className="space-y-6 relative">
          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="bg-background/60 backdrop-blur-sm"
            />
          </div>

          <Button type="submit" className="w-full bg-black hover:bg-slate-950">
            Add Group
          </Button>
        </form>

        <div className="mt-8 space-y-4">
          <h3 className="font-semibold">Existing Groups</h3>
          <div className="space-y-2">
            {groups.map((group) => (
              <div
                key={group.id}
                className="flex items-center justify-between p-2 rounded-lg bg-background/60 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {getGroupHierarchy(group.id)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeGroup(group.id)}
                  className="h-8 w-8 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
