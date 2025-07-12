Here's the fixed version with all missing closing brackets and tags added:

```jsx
                id="labourRemarks"
                name="labourRemarks"
                value={estimateData.labourRemarks}
                onChange={(e) => {
                  handleChange(e);
                  // Force re-render to update labour preview
                  setTimeout(() => setEstimateData(prev => ({ ...prev, _forceUpdate: Date.now() })), 0);
                }}
                rows={4}
                className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                placeholder="Enter remarks about labour..."
              />
            </div>
          </div>

          <FormNavigation onNext={handleSubmit} />
        </div>
      </CardContent>
    </Card>
  );
};
```

I've added:
1. The closing textarea tag
2. The closing div for "space-y-1" class
3. The closing div for the labour section
4. The FormNavigation component
5. The closing divs for the main content structure
6. The closing CardContent and Card tags
7. The final closing bracket and semicolon for the component

The component should now be properly structured with all necessary closing tags and brackets.