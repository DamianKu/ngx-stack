import { HttpContext, HttpContextToken } from "@angular/common/http";
import { mergeHttpContext } from "./ngx-http-merge-context";

const TEST_TOKEN_1 = new HttpContextToken<string>(() => "TOKEN:1");
const TEST_TOKEN_2 = new HttpContextToken<string>(() => "TOKEN:2");
const TEST_TOKEN_3 = new HttpContextToken<string>(() => "TOKEN:3");

const TEST_CASES: {
    contexts: HttpContext[];
    expectedTokenValues: [HttpContextToken<unknown>, unknown][]
}[] = [
        {
            contexts: [
                new HttpContext()
            ],
            expectedTokenValues: []
        },
        {
            contexts: [
                new HttpContext(),
                new HttpContext(),
                new HttpContext(),
            ],
            expectedTokenValues: []
        },
        {
            contexts: [
                new HttpContext().set(TEST_TOKEN_3, "XXX")
            ],
            expectedTokenValues: [
                [TEST_TOKEN_3, 'XXX']
            ]
        },

        {
            contexts: [
                new HttpContext(),
                new HttpContext(),
                new HttpContext().set(TEST_TOKEN_3, "XXX"),
                new HttpContext(),
                new HttpContext(),

            ],
            expectedTokenValues: [
                [TEST_TOKEN_3, 'XXX']
            ]
        },
        {
            contexts: [
                new HttpContext().set(TEST_TOKEN_1, "NEW_VALUE_TOKEN:1"),
                new HttpContext().set(TEST_TOKEN_1, "UPDATED_VALUE_TOKEN:1"),
            ],
            expectedTokenValues: [
                [TEST_TOKEN_1, "UPDATED_VALUE_TOKEN:1"]
            ]
        },
        {
            contexts: [
                new HttpContext().set(TEST_TOKEN_1, "NEW_VALUE_TOKEN:1"),
                new HttpContext().set(TEST_TOKEN_2, "NEW_VALUE_TOKEN:2"),
            ],
            expectedTokenValues: [
                [TEST_TOKEN_1, "NEW_VALUE_TOKEN:1"],
                [TEST_TOKEN_2, "NEW_VALUE_TOKEN:2"],
            ]
        },

        {
            contexts: [
                new HttpContext().set(TEST_TOKEN_1, "NEW_VALUE_TOKEN:1").set(TEST_TOKEN_3, ""),
                new HttpContext().set(TEST_TOKEN_1, "OTHER_NEW_VALUE_TOKEN:1"),
                new HttpContext().set(TEST_TOKEN_2, "NEW_VALUE_TOKEN:2").set(TEST_TOKEN_3, "NEW_VALUE_TOKEN:3")
            ],
            expectedTokenValues: [
                [TEST_TOKEN_1, "OTHER_NEW_VALUE_TOKEN:1"],
                [TEST_TOKEN_2, "NEW_VALUE_TOKEN:2"],
                [TEST_TOKEN_3, "NEW_VALUE_TOKEN:3"]
            ]
        }
    ];

describe('NgxMergeHttpContext', () => {
    it('should return empty HttpContext if nothing provided', () => {
        const result = mergeHttpContext();

        expect(result instanceof HttpContext).toBe(true);
        expect([...result.keys()].length).toEqual(0);
    });

    describe("merging contexts", () => {
        TEST_CASES.forEach(({ contexts, expectedTokenValues }, i) => {
            it(`[${i}] should merge contexts`, () => {
                const merged = mergeHttpContext(...contexts);

                expect([...merged.keys()].length).toEqual(expectedTokenValues.length);

                expectedTokenValues.forEach(([token, value]) => {
                    expect(merged.get(token)).toEqual(value);
                });
            })
        });
    });
});