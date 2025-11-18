import { useState } from "react";
import type { QuestionsDB } from "@/components/dto/question";
import { SearchBar } from "@/components/SearchBar";
import { MagicCard } from "@/components/magicui/magic-card";
import { Badge } from "@/components/ui/badge";
import { questionTypeEmoji } from "@/lib/questionTypeEmoji";
import classNames from "classnames";

interface QuestionListWithSearchProps {
  initialItems: QuestionsDB[];
  baseUrl: string;
}

export function QuestionListWithSearch({
  initialItems,
  baseUrl,
}: QuestionListWithSearchProps) {
  const [filteredItems, setFilteredItems] = useState<QuestionsDB[]>(initialItems);

  return (
    <div>
      <SearchBar
        items={initialItems}
        onFilteredItemsChange={setFilteredItems}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No question sets found matching your search.
          </div>
        ) : (
          filteredItems
            .filter((q) => q.slug && q.title)
            .map((q) => (
              <a
                key={q.slug}
                href={`${baseUrl}q/${q.slug}`}
                className={classNames("no-underline", {
                  "row-span-2": !!q.description,
                })}
                aria-label={`Go to ${q.title}`}
              >
                <MagicCard
                  className="p-4 rounded flex gap-2 h-full"
                  gradientOpacity={0.05}
                >
                  <div>
                    {q.questionType && questionTypeEmoji[q.questionType] && (
                      <span className="text-2xl" aria-label={q.questionType}>
                        {questionTypeEmoji[q.questionType]}
                      </span>
                    )}
                    <span
                      style={{
                        viewTransitionName: q.slug,
                      } as React.CSSProperties}
                    >
                      {q.title}
                    </span>
                    {q.description && (
                      <span className="block text-xs text-gray-500 mt-1">
                        {q.description}
                      </span>
                    )}
                    {Array.isArray(q.labels) && q.labels.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {q.labels.map((label) => (
                          <Badge
                            key={label}
                            variant={"outline"}
                            aria-label={`Label: ${label}`}
                          >
                            {label}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </MagicCard>
              </a>
            ))
        )}
      </div>
    </div>
  );
}
