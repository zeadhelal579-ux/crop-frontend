/**
 * Screen title band shown under the floating top navigation: a large white
 * heading (with an optional eyebrow chip above it) on the start side and
 * optional chips/actions on the end side.
 */
import { PageContainer } from "./PageContainer";

/** Render the page title, an optional eyebrow, description and trailing chips. */
export function PageHero({ title, eyebrow, description, children }) {
  return (
    <PageContainer className="flex flex-wrap items-end justify-between gap-3 pb-5 pt-8">
      <div>
        {eyebrow ? (
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-neutral-800/80 px-3 py-1 text-[10px] font-bold uppercase text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary-400" aria-hidden="true" />
            {eyebrow}
          </span>
        ) : null}
        <h1 className="text-3xl font-bold text-white sm:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-xl text-sm text-white/80">{description}</p> : null}
      </div>
      {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
    </PageContainer>
  );
}
