"use client"

import { Code, MessageSquare, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
}

interface TeamCardProps {
  id: string
  name: string
  description: string
  members: TeamMember[]
  tags: string[]
  isJoined?: boolean
  onJoin?: () => void
}

export function TeamCard({ id, name, description, members, tags, isJoined = false, onJoin }: TeamCardProps) {
  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          {isJoined ? (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Joined
            </Badge>
          ) : (
            <Button size="sm" onClick={onJoin}>
              Join Team
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-secondary/10 text-secondary-foreground border-secondary/20"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex -space-x-2">
            {members.slice(0, 4).map((member) => (
              <Avatar key={member.id} className="border-2 border-background h-8 w-8">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {members.length > 4 && (
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium">
                +{members.length - 4}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-muted-foreground text-sm">
            <div className="flex items-center gap-1">
              <Code className="h-4 w-4" />
              <span>12</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>24</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

