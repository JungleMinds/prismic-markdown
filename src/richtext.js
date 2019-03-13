import PrismicRichText, { Elements } from "prismic-richtext";
import { Link as LinkHelper } from "prismic-helpers";

function serialize(linkResolver, type, element, content, children) {
  switch (type) {
    case Elements.heading1:
      return serializeHeading("#", element, children);
    case Elements.heading2:
      return serializeHeading("##", element, children);
    case Elements.heading3:
      return serializeHeading("###", element, children);
    case Elements.heading4:
      return serializeHeading("####", element, children);
    case Elements.heading5:
      return serializeHeading("#####", element, children);
    case Elements.heading6:
      return serializeHeading("######", element, children);
    case Elements.paragraph:
      return serializeParagraph(element, children);
    case Elements.preformatted:
      return serializePreFormatted(element);
    case Elements.strong:
      return serializeStrong(element, children);
    case Elements.em:
      return serializeEm(element, children);
    case Elements.listItem:
      return serializeUl(element, children);
    case Elements.oListItem:
      return serializeOl(element, children);
    case Elements.list:
      return serializeParagraph(element, children);
    case Elements.oList:
      return serializeParagraph(element, children);
    case Elements.image:
      return serializeImage(linkResolver, element);
    case Elements.hyperlink:
      return serializeHyperlink(linkResolver, element, children);
    case Elements.embed: // no MD support fall back to image with link
      return serializeEmbed(element);
    case Elements.label: // no MD support, fall back to span
      return serializeSpan(element, children);
    case Elements.span:
      return serializeSpan(content);
    default:
      return "";
  }
}

function serializeHeading(heading, element, children) {
  return `${heading} ${children.join("")}\n\n`;
}

function serializeParagraph(element, children) {
  return `${children.join("")}\n\n`;
}

function serializePreFormatted(element) {
  return `${"```"}\n${element.text}\n${"```"}\n\n`;
}

function serializeStrong(element, children) {
  return `**${children.join("")}**`;
}

function serializeEm(element, children) {
  return `_${children.join("")}_`;
}

function serializeUl(element, children) {
  return `- ${children.join("")}\n`;
}

function serializeOl(element, children) {
  return `0. ${children.join("")}\n`;
}

function serializeImage(linkResolver, element) {
  const linkUrl = element.linkTo
    ? LinkHelper.url(element.linkTo, linkResolver)
    : null;

  const img = `![${element.alt || ""}](${element.url}${
    element.copyright ? ` "${element.copyright}"` : ""
  })`;
  return `${linkUrl ? `[${img}](${linkUrl})` : img}\n\n`;
}

function serializeHyperlink(linkResolver, element, children) {
  return `[${children.join("")}](${LinkHelper.url(
    element.data,
    linkResolver
  )})`;
}

function serializeEmbed(element) {
  return `[![${element.oembed.title}](${element.oembed.thumbnail_url || ""})](${
    element.oembed.embed_url
  }${
    element.oembed.provider_name
      ? ` "embed-${element.oembed.provider_name.toLowerCase()}"`
      : ' "embed"'
  })\n\n`;
}

function serializeSpan(content) {
  return content ? content.replace(/\n/g, "<br />") : "";
}

export default {
  asText(structuredText, joinString) {
    return PrismicRichText.asText(structuredText, joinString).trim();
  },

  asMarkdown(richText, linkResolver) {
    const serialized = PrismicRichText.serialize(
      richText,
      serialize.bind(null, linkResolver)
    );
    return serialized.join("").trim();
  },

  Elements: Elements
};
