import { useState } from "react"
import { useStore } from "@/store/appStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FolderPlus, Trash2 } from "lucide-react"

export default function GroupManager() {
  const [groupName, setGroupName] = useState("")
  const { groups, addGroup, removeGroup } = useStore()

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault()
    if (!groupName.trim()) return
    addGroup(groupName.trim())
    setGroupName("")
  }

  const getGroupHierarchy = (groupId: string): string => {
    const group = groups.find((g) => g.id === groupId)
    if (!group) return ""
    if (group.parentId) {
      const parentHierarchy = getGroupHierarchy(group.parentId)
      return parentHierarchy
        ? `${parentHierarchy} › ${group.name}`
        : group.name
    }
    return group.name
  }

  return (
    <div className="surface-card p-5">
      <div className="mb-4">
        <h3 className="font-semibold">Groups</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Organize images into collections
        </p>
      </div>

      <form onSubmit={handleAddGroup} className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="groupName" className="sr-only">
            Group Name
          </Label>
          <Input
            id="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="New group name"
            className="bg-background"
          />
        </div>
        <Button type="submit" variant="outline" className="w-full">
          <FolderPlus className="h-4 w-4" />
          Add group
        </Button>
      </form>

      <div className="mt-5 space-y-2">
        {groups.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">
            No groups yet. Create one to filter your library.
          </p>
        ) : (
          groups.map((group) => (
            <div
              key={group.id}
              className="flex items-center justify-between gap-2 rounded-lg border bg-background/70 px-3 py-2"
            >
              <span className="text-sm font-medium truncate">
                {getGroupHierarchy(group.id)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeGroup(group.id)}
                className="h-8 w-8 shrink-0 hover:text-destructive"
                aria-label={`Delete ${group.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
