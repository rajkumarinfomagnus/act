#!/bin/bash

# Load the default JSON file
default_json=$(cat ./provisioner/settings/defaults/enterprise-repo-settings.json)

# Create the output directory if it doesn't exist
mkdir -p ./provisioner/output

# Iterate over each JSON file in the directory
for file in ./provisioner/settings/*/*.json; do
  # Load the provided JSON file
  provided_json=$(cat "$file")

  # Copy all settings from default.json
  output_json=$default_json

  # Iterate over each entity in optional settings of default.json
  for entity in $(jq -r '.repository.optional | keys[]' <<< "$default_json"); do
    # Get the values from provided.json
    provided_value=$(jq -r ".$entity" <<< "$provided_json")

    # Check if the entity exists in provided.json
    if [ "$provided_value" != "null" ]; then
      # Entity is in provided.json, use the entity given in provided.json
      output_json=$(jq --arg key "$entity" --arg value "$provided_value" '.repository.optional = (.repository.optional + {($key): $value})' <<< "$output_json")
    fi
  done

  # Iterate over each entity in provided.json
  for entity in $(jq -r 'keys[]' <<< "$provided_json"); do
    # Check if the entity exists in output.json's mandatory or optional fields
    output_value_mandatory=$(jq -r ".repository.mandatory.$entity" <<< "$output_json")
    output_value_optional=$(jq -r ".repository.optional.$entity" <<< "$output_json")
    if [ "$output_value_mandatory" == "null" ] && [ "$output_value_optional" == "null" ]; then
      # Entity is not in output.json's mandatory or optional fields, use the entity given in provided.json
      provided_value=$(jq -r ".$entity" <<< "$provided_json")
      output_json=$(jq --arg key "$entity" --arg value "$provided_value" '.repository.optional = (.repository.optional + {($key): $value})' <<< "$output_json")
    fi
  done

  # Get the filename from the file path
  filename=$(basename -- "$file")

  # Write the output JSON to a file in the output directory
  echo "$output_json" | jq . > "./provisioner/output/$filename"
  cat "./provisioner/output/$filename"
done
