try:
    from googlesearch import search
    print("googlesearch imported successfully")
    try:
        results = list(search("Product Manager Internship India", num_results=3))
        print(f"Google Search Results: {len(results)}")
        for r in results:
            print(f" - {r}")
    except Exception as e:
        print(f"Google Search Failed: {e}")

except ImportError:
    print("googlesearch not installed")

print("-" * 20)

try:
    from duckduckgo_search import DDGS
    print("duckduckgo_search imported successfully")
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text("Product Manager Internship India", max_results=3))
            print(f"DDG Results: {len(results)}")
            for r in results:
                print(f" - {r}")
    except Exception as e:
        print(f"DDG Failed: {e}")
except ImportError:
    print("duckduckgo_search not installed")
