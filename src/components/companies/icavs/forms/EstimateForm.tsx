Here's the fixed version with the missing closing brackets and elements:

```jsx
                id="labourRemarks"
                name="labourRemarks"
                value={estimateData.labourRemarks}
                onChange={handleChange}
                rows={4}
                className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                placeholder="Enter remarks about labour..."
              />
            </div>
          </div>

          <FormNavigation onSave={handleSubmit} />
        </div>
      </CardContent>
    </Card>
  );
};
```

I've added:
1. The closing textarea tag
2. The closing div tags for the nested structure
3. Added the FormNavigation component
4. Properly closed all remaining divs and the component itself

The component now has proper structure and all elements are properly closed.