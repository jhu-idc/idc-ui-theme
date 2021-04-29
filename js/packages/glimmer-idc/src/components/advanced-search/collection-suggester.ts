import Component, { hbs, tracked } from '@glimmerx/component';

interface Args {
  /**
   * The field name in which the user input is matched against in order
   * to provide collection suggestions.
   *
   * MUST be the machine-readable field (property) on a collection
   *
   * If no value is provided, the `title` field will be used.
   */
  field?: string;
  /**
   * The method by which matches are found in the collection field. MUST be
   * one of the following:
   *
   * '=', '<>', '>', '>=', '<', '<=', 'STARTS_WITH', 'CONTAINS', 'ENDS_WITH',
   * 'IN', 'NOT IN', 'BETWEEN', 'NOT BETWEEN', 'IS NULL', 'IS NOT NULL',
   *
   * If no operator is provided, the component will default to use 'CONTAINS'
   */
  operator?: string;
}

/**
 * This component can suggest Collections based on user input. By default,
 * the component will suggest collections that contain a match of the user
 * input value anywhere within the collection's title. The field in which
 * to match and the method of matching can be configured -- see `Args`
 */
export default class CollectionSuggester extends Component<Args> {

  @tracked field: string;
  @tracked operator: string;

  constructor(owner: unknown, args: Args) {
    super(owner, args);

    this.field = this.args.field || 'title';
    this.operator = this.args.operator || 'CONTAINS'
  }
  static template = hbs``;
}
