import { TElement, TNode, TText, Value } from 'platejs';

const CONTENT_CONTAINER_TYPES = [
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'hr', 'blockquote',
  'code_block', 'code_line',
  'table', 'tr', 'td', 'th',
  'action_item', 'todo_list',
  'toggle',
  'callout',
  'column_group',
  'column',
  'caption',
];

/**
 * Checks if the given nodes contain any content.
 *
 * A node is considered to have content if:
 *  1. It is a text node with non-empty text.
 *  2. It is a container element with non-empty text in its
 *     immediate children.
 *  3. It is a special element (e.g., image, video, etc.) with a type.
 *  4. It is a container element with nested structures (e.g., tables,
 *     lists, columns, and toggles) containing content.
 *
 * @param nodes - The nodes to check for content.
 * @returns True if the nodes contain any content, false otherwise.
 */
export const hasPlateContent = (nodes: Value): boolean => {
  if (!Array.isArray(nodes) || nodes.length === 0) return false;

  return nodes.some((node: TNode) => {
    const element = node as TElement;

    // Direct check for text nodes (leaf nodes)
    if ('text' in node) {
      return (node as TText).text.trim() !== "";
    }

    // Check for non-empty text within immediate children
    const hasText = element.children?.some((child) => {
      const textNode = child as TText;
      return textNode.text && textNode.text.trim() !== "";
    });
    if (hasText) return true;

    // Robust check for container types
    const nodeType = (element.type as string) || '';
    const isContainer = CONTENT_CONTAINER_TYPES.includes(nodeType);

    // Treat non-container elements as valid content
    // If it has a type but isn't a wrapper, it's considered substance (e.g., an image, video, etc.)
    const isMediaOrSpecial = !!nodeType && !isContainer;
    if (isMediaOrSpecial) return true;

    // Deep search for nested structures (Crucial for tables, lists, columns, and toggles)
    if (element.children?.length) {
      if (hasPlateContent(element.children as Value)) return true;
    }

    return false;
  });
};

/**
 * Returns the total length of the given nodes.
 * This length is calculated by summing up the trimmed text length of text nodes,
 * and counting each media/void element as 1 unit.
 *
 * @param nodes - The nodes to calculate the total length of.
 * @returns The total length of the given nodes.
 */
export const getTotalLength = (nodes: Value): number => {
  return nodes.reduce((acc, node: TNode) => {
    const element = node as TElement;

    // If it's a text node, add its trimmed length
    if ('text' in node) {
      return acc + (node as TText).text.trim().length;
    }

    // If it's a container, recurse through children
    const nodeType = (element.type as string) || '';
    const isContainer = CONTENT_CONTAINER_TYPES.includes(nodeType);

    if (isContainer && element.children?.length) {
      return acc + getTotalLength(element.children as Value);
    }

    // If it's a media/void element (not a container), count it as 1 unit
    // This ensures images/videos contribute to the "length"
    if (!!nodeType && !isContainer) {
      return acc + 1;
    }

    return acc;
  }, 0);
};