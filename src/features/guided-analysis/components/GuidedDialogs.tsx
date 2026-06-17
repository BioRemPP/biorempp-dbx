import { GuidedUseCaseOverviewCard } from '@/features/guided-analysis/components/GuidedUseCaseOverviewCard';
import { UseCaseMethodsModal } from '@/features/guided-analysis/dialogs/UseCaseMethodsModal';
import { UseCaseQueryRecipesModal } from '@/features/guided-analysis/dialogs/UseCaseQueryRecipesModal';
import {
  getGuidedMethodsButtonLabel,
  getGuidedRecipesButtonLabel,
} from '@/features/guided-analysis/presentation';
import type { GuidedQueryDefinition } from '@/features/guided-analysis/types';
import type { GuidedQueryRecipe } from '@/types/frontConfig';

interface GuidedDialogsProps {
  query: GuidedQueryDefinition;
  recipe?: GuidedQueryRecipe;
}

export function GuidedDialogs({ query, recipe }: GuidedDialogsProps) {
  const headerAction = (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <UseCaseMethodsModal
        content={query.methods_modal}
        buttonLabelOverride={getGuidedMethodsButtonLabel()}
      />
      {recipe ? (
        <UseCaseQueryRecipesModal
          content={recipe}
          buttonLabelOverride={getGuidedRecipesButtonLabel()}
        />
      ) : null}
    </div>
  );

  return <GuidedUseCaseOverviewCard content={query.use_case_description} headerAction={headerAction} />;
}
