import { expect } from "chai";
import RichText from "../src/richtext.js";
const asText = RichText.asText;
const asMarkdown = RichText.asMarkdown;

const mock = [
  {
    type: "heading1",
    text: "Title",
    spans: []
  },
  {
    type: "paragraph",
    text: "A > B",
    spans: []
  },
  {
    type: "preformatted",
    text: "<example>\n  TEST\n</example>",
    spans: []
  },
  {
    type: "paragraph",
    text: "This is bold and italic and >:) both.",
    spans: [
      {
        start: 8,
        end: 12,
        type: "strong"
      },
      {
        start: 17,
        end: 23,
        type: "em"
      },
      {
        start: 28,
        end: 36,
        type: "strong"
      },
      {
        start: 28,
        end: 36,
        type: "em"
      }
    ]
  },
  {
    type: "image",
    url: "/media/some-image.jpg",
    alt: null,
    copyright: null,
    dimensions: { width: 1500, height: 1000 }
  },
  {
    type: "image",
    url: "/media/some-image-with-info.jpg",
    alt: "with alt info",
    copyright: "and a copyright",
    dimensions: { width: 1500, height: 1000 }
  },
  {
    type: "embed",
    oembed: {
      type: "video",
      embed_url: "https://www.youtube.com/watch?v=youtube-id",
      title: "Video Title",
      provider_name: "YouTube",
      thumbnail_url: "https://i.ytimg.com/vi/youtube-id/hqdefault.jpg",
      version: "1.0",
      author_url: "https://www.youtube.com/channel/channel-id",
      author_name: "Channel Name",
      provider_url: "https: //www.youtube.com/",
      height: 270,
      width: 480,
      thumbnail_height: 360,
      html: "<some html/>"
    }
  }
];

describe("asText", function() {
  context(
    "applying mock object using default join string (undefined)",
    function() {
      const result = asText(mock);

      // Note: Currently there is '\n ' added to the output.
      // See: https://github.com/prismicio/prismic-richtext/issues/7
      // Until pull request https://github.com/prismicio/prismic-richtext/pull/8
      // is released, we test for the old behaviour.
      it("should join blocks with one whitespace (default)", function() {
        expect(result).to.equal(
          "Title A > B <example>\n  TEST\n</example> This is bold and italic and >:) both."
        );
      });
    }
  );

  // Until pull request https://github.com/prismicio/prismic-richtext/pull/8
  // is released skip the following test...
  // context('applying mock object and join string "\\n"', function() {
  //   const result = asText(mock, '\n');

  //   it('should join blocks with one line break', function() {
  //     expect(result).to.equal('A > B\n<example>\n  TEST\n</example>\nThis is bold and italic and >:) both.');
  //   });
  // });
});

describe("asMarkdown", function() {
  context("applying mock object", function() {
    const result = asMarkdown(mock);
    const expectations = [
      "# Title\n\n",
      "A > B\n\n",
      "```\n<example>\n  TEST\n</example>\n```\n\n",
      "This is **bold** and _italic_ and **_>:) both_**.\n\n",
      "![](/media/some-image.jpg)\n\n",
      '![with alt info](/media/some-image-with-info.jpg "and a copyright")\n\n',
      '[![Video Title](https://i.ytimg.com/vi/youtube-id/hqdefault.jpg)](https://www.youtube.com/watch?v=youtube-id "embed-youtube")'
    ];

    it("should contain the first paragraph with special character escaped", function() {
      expect(result).have.string(expectations[0]);
    });

    it("should contain the preformatted element with special character escaped and line breaks preserved", function() {
      expect(result).have.string(expectations[1]);
    });

    it("should contain the second paragraph with tags added special character escaped in text content only", function() {
      expect(result).have.string(expectations[2]);
    });

    it("should contain a images with and without info", function() {
      expect(result).have.string(expectations[4]);
      expect(result).have.string(expectations[5]);
    });

    it("should contain a fallback for embeds", function() {
      expect(result).have.string(expectations[6]);
    });

    it("should equal the expected string in full", function() {
      expect(result).to.equal(expectations.join("").trim());
    });
  });
});
